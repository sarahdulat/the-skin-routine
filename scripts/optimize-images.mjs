import { createHash } from "node:crypto";
import { mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const publicImagesDir = path.join(root, "public/images");
const optimizedDir = path.join(publicImagesDir, "optimized");
const markerDir = path.join(optimizedDir, "routine-markers");
const markerMapPath = path.join(root, "src/generated/routine-marker-images.ts");
const reviewWidths = [480, 800, 1200];
const skipRemoteMarkers = process.argv.includes("--skip-remote");
const sourceExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);

async function walkImages(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (fullPath.startsWith(optimizedDir)) return [];
      return walkImages(fullPath);
    }

    return sourceExtensions.has(path.extname(entry.name).toLowerCase()) ? [fullPath] : [];
  }));

  return files.flat();
}

function publicPath(filePath) {
  return `/${path.relative(path.join(root, "public"), filePath).split(path.sep).join("/")}`;
}

function optimizedReviewPath(filePath, width, format) {
  const relativePath = path.relative(publicImagesDir, filePath);
  const parsed = path.parse(relativePath);
  const filename = `${parsed.name}-${width}.${format}`;

  return path.join(optimizedDir, parsed.dir, filename);
}

async function exists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function optimizeReviewImages() {
  const imagePaths = await walkImages(publicImagesDir);
  let generated = 0;

  for (const imagePath of imagePaths) {
    for (const width of reviewWidths) {
      for (const format of ["avif", "webp"]) {
        const outputPath = optimizedReviewPath(imagePath, width, format);
        if (await exists(outputPath)) continue;

        await mkdir(path.dirname(outputPath), { recursive: true });
        const image = sharp(imagePath).resize({ width, withoutEnlargement: true });

        if (format === "avif") {
          await image.avif({ quality: 58, effort: 6 }).toFile(outputPath);
        } else {
          await image.webp({ quality: 78 }).toFile(outputPath);
        }

        generated += 1;
      }
    }
  }

  return generated;
}

function markerFilename(url) {
  return `${createHash("sha256").update(url).digest("hex").slice(0, 16)}.webp`;
}

async function fetchImageBuffer(url) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "TheSkinRoutineImageOptimizer/1.0",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return Buffer.from(await response.arrayBuffer());
}

function isImageString(image) {
  return typeof image === "string" && image.length > 0;
}

function routineMarkerImage(routine) {
  const sourceImage = routine.sources?.map((source) => source.image).filter(isImageString)[0];

  return routine.celebrity_face_image || sourceImage;
}

async function optimizeRoutineMarkers() {
  const routinesPath = path.join(root, "src/assets/routines.json");
  const routines = JSON.parse(await readFile(routinesPath, "utf8"));
  const markerUrls = [...new Set(routines.map(routineMarkerImage).filter(isImageString))];
  const markerMap = {};
  let generated = 0;

  await mkdir(markerDir, { recursive: true });

  for (const url of markerUrls) {
    const filename = markerFilename(url);
    const outputPath = path.join(markerDir, filename);
    markerMap[url] = publicPath(outputPath);

    if (await exists(outputPath)) continue;

    try {
      const buffer = await fetchImageBuffer(url);
      await sharp(buffer)
        .resize(96, 96, { fit: "cover", position: "attention" })
        .webp({ quality: 78 })
        .toFile(outputPath);
      generated += 1;
    } catch (error) {
      delete markerMap[url];
      console.warn(`Skipped marker image: ${url} (${error.message})`);
    }
  }

  await mkdir(path.dirname(markerMapPath), { recursive: true });
  await writeFile(
    markerMapPath,
    `export const routineMarkerImages: Record<string, string> = ${JSON.stringify(markerMap, null, 2)};\n`,
  );

  return generated;
}

const reviewCount = await optimizeReviewImages();
const markerCount = skipRemoteMarkers ? 0 : await optimizeRoutineMarkers();

console.log(`Generated ${reviewCount} review image variants.`);
console.log(skipRemoteMarkers ? "Skipped remote routine marker refresh." : `Generated ${markerCount} routine marker thumbnails.`);
