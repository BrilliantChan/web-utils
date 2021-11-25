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

const mapState = function (name, mapper) {
    const mapperFn = name.length > 0 
        ? mapperFn = createNamespacedHelpers(name).mapState
        : mapState;

    return useStateMapper(mapper, mapperFn);
};

const mapGetters = function (name, mapper) {
    const mapperFn = name.length > 0 
        ? mapperFn = createNamespacedHelpers(name).mapGetters
        : mapGetters;

    return useStateMapper(mapper, mapperFn);
};

const mapActions = function (name, mapper) {
    const mapperFn = name.length > 0 
        ? mapperFn = createNamespacedHelpers(name).mapActions
        : mapActions;

    return useStateMapper(mapper, mapperFn);
};

const mapMutations = function (name, mapper) {
    const mapperFn = name.length > 0 
        ? mapperFn = createNamespacedHelpers(name).mapMutations
        : mapMutations;

    return useStateMapper(mapper, mapperFn);
};

export {
    mapState,
    mapGetters,
    mapActions,
    mapMutations
};