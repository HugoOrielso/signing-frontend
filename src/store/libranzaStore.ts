'use client';



import { emptyLibranza, LibranzaForm, ProductoItem } from '@/types/libranza';
import { create } from 'zustand';


interface LibranzaState {
  form: LibranzaForm;
  step: number;

  setForm: (form: LibranzaForm) => void;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetForm: () => void;

  addProducto: () => void;
  removeProducto: (index: number) => void;
  updateProducto: (index: number, patch: Partial<ProductoItem>) => void;
}

export const useLibranzaStore = create<LibranzaState>((set) => ({
  form: emptyLibranza,
  step: 1,

  setForm: (form) => set({ form }),

  setStep: (step) => set({ step }),
  nextStep: () => set((state) => ({ step: state.step + 1 })),
  prevStep: () => set((state) => ({ step: Math.max(1, state.step - 1) })),
  resetForm: () => set({ form: emptyLibranza, step: 1 }),

  addProducto: () =>
    set((state) => ({
      form: {
        ...state.form,
        productos: [...state.form.productos, { codigo: '', descripcion: '', valor: '' }],
      },
    })),

  removeProducto: (index) =>
    set((state) => ({
      form: {
        ...state.form,
        productos:
          state.form.productos.length > 1
            ? state.form.productos.filter((_, i) => i !== index)
            : state.form.productos,
      },
    })),

  updateProducto: (index, patch) =>
    set((state) => ({
      form: {
        ...state.form,
        productos: state.form.productos.map((item, i) =>
          i === index ? { ...item, ...patch } : item
        ),
      },
    })),
}));