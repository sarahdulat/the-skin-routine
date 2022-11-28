<template>
  <div class="home">
    <RoutineChart
      :axisData="axisData"
      :coupons="coupons"
      title="Tickets vs. Value"
      :companies="companies" />
  </div>
</template>

<script>
import RoutineChart from "../components/RoutineChart.vue";
import { coupons } from "../../public/json/coupons.json";

export default {
  name: "App",
  components: {
    RoutineChart
  },
  data () {
    return {
      coupons,
      axisData: coupons
        .filter(el => el.promotion_type === 'percent-off')
        .map(el => ({ x: el.coupon_id, y: el.value, company: el.webshop_id }))
    };
  },
  computed: {
    companies() {
      return [...new Set(this.coupons.map(el => el.webshop_id))]
    },
  }
};
</script>
