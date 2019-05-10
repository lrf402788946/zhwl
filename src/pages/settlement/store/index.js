import Vue from 'vue';
import Vuex from 'vuex';
import * as publics from '@/store/publicStore';
import * as personnel from '@/pages/personnel/store/personnelStore';
import * as car from '@/pages/car/store/carStore';
import * as settlement from '@/pages/settlement/store/settlementStore';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    publics: publics,
    personnel: personnel,
    car: car,
    settlement: settlement,
  },
});
