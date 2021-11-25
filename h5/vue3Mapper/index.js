import {
    useStore,
    mapState,
    mapGetters, 
    mapActions,
    mapMutations,
    createNamespacedHelpers
} from 'vuex'
import {computed} from 'vue'

function useStateMapper(mapper, mapFn) {
    const store = useStore();
    const storeStateFns = mapFn(mapper);
    const storeState = {};

    Object.keys(storeStateFns).forEach(fnKey => {
        // vuex源码中mapState和mapGetters的方法中使用的是this.$store,所以更改this绑定
        const fn = storeStateFns[fnKey].bind({
            $store: store 
        });

        storeState[fnKey] = computed(fn)

    })

   return storeState
};

function useActionMapper(mapper, mapFn) {
    const store = useStore();
    const storeActionsFns = mapFn(mapper);
    const storeAction = {};

    Object.keys(storeActionsFns).forEach(fnKey => {
        storeAction[fnKey] = storeActionsFns[fnKey].bind({
            $store: store 
        })
    })

    return storeAction
};

const useState = function (name, mapper) {
    const mapperFn = name.length > 0 
        ? createNamespacedHelpers(name).mapState
        : mapState;

    return useStateMapper(mapper, mapperFn);
};

const useGetters = function (name, mapper) {
    const mapperFn = name.length > 0 
        ? createNamespacedHelpers(name).mapGetters
        : mapGetters;

    return useStateMapper(mapper, mapperFn);
};

const useActions = function (name, mapper) {
    const mapperFn = name.length > 0 
        ? createNamespacedHelpers(name).mapActions
        : mapActions;

    return useActionMapper(mapper, mapperFn);
};

const useMutations = function (name, mapper) {
    const mapperFn = name.length > 0 
        ? createNamespacedHelpers(name).mapMutations
        : mapMutations;

    return useActionMapper(mapper, mapperFn);
};

export {
    useState,
    useGetters,
    useActions,
    useMutations
};