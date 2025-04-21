import { create } from 'zustand';

const useGlobalStore = create((set) => ({
    // Products state
    products: [],
    loading: false,
    error: null,
    paginationData: {
        total: 0,
        page: 1,
        limit: 20,
        pages: 1
    },

    // Filters state
    availableFilters: {
        colors: [],
        brands: [],
        materials: [],
        productTypes: [],
        productGroups: [],
        genders: []
    },
    selectedFilters: {},
    defaultFilters: {},

    // Configuration state
    config: {
        maxProducts: null,
        itemsPerPage: 20,
        showFilters: true,
        showSort: true,
        collectionName: null
    },

    // Actions
    setProducts: (products) => set({ products }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    setPaginationData: (data) => set((state) => ({
        paginationData: { ...state.paginationData, ...data }
    })),
    
    setAvailableFilters: (filters) => set((state) => ({
        availableFilters: { ...state.availableFilters, ...filters }
    })),
    
    setSelectedFilters: (filters) => set((state) => ({
        selectedFilters: { ...state.selectedFilters, ...filters }
    })),
    
    setDefaultFilters: (filters) => set((state) => ({
        defaultFilters: { ...state.defaultFilters, ...filters }
    })),

    setConfig: (config) => set((state) => ({
        config: { ...state.config, ...config }
    })),

    // Reset states
    resetProducts: () => set({
        products: [],
        loading: false,
        error: null,
        paginationData: {
            total: 0,
            page: 1,
            limit: 20,
            pages: 1
        }
    }),

    resetFilters: () => set({
        availableFilters: {
            colors: [],
            brands: [],
            materials: [],
            productTypes: [],
            productGroups: [],
            genders: []
        },
        selectedFilters: {},
        defaultFilters: {}
    })
}));

export default useGlobalStore; 