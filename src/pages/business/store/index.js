import Vue from 'vue';
import Vuex from 'vuex';
import * as publics from '@/store/publicStore';
import * as self from './businessStore';
import * as personnel from '@/pages/personnel/store/personnelStore';
import * as car from '@/pages/car/store/carStore';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    publics: publics,
    self: self,
    personnel: personnel,
    car: car,
  },
});
