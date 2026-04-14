import { LibranzaReviewForm, toReviewForm } from "@/helpers/toRevieForm";
import {
  emptyLibranza,
  emptyLibranzaToReview,
  LibranzaForm,
  ProductoItem,
} from "@/types/libranza";
import { create } from "zustand";

export type DataReviewStatus = "PENDING" | "APPROVED" | "REJECTED";


interface LibranzaState {
  form: LibranzaForm;
  reviewForm: LibranzaReviewForm;
  step: number;

  dataReviewStatus: DataReviewStatus | null;
  dataReviewNotes: string | null;

  setForm: (form: LibranzaForm) => void;
  setReviewForm: (form: LibranzaReviewForm) => void;

  hydrateRejectedForm: (payload: {
    form: LibranzaForm;
    dataReviewStatus: DataReviewStatus;
    dataReviewNotes: string | null;
  }) => void;

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
  reviewForm: emptyLibranzaToReview,
  step: 1,

  dataReviewStatus: null,
  dataReviewNotes: null,

  setForm: (form) => set({ form }),
  setReviewForm: (reviewForm) => set({ reviewForm }),

  hydrateRejectedForm: ({ form, dataReviewStatus, dataReviewNotes }) =>
    set({
      form,
      reviewForm: toReviewForm(form),
      dataReviewStatus,
      dataReviewNotes,
    }),

  setStep: (step) => set({ step }),
  nextStep: () => set((state) => ({ step: state.step + 1 })),
  prevStep: () => set((state) => ({ step: Math.max(1, state.step - 1) })),
  resetForm: () =>
    set({
      form: emptyLibranza,
      reviewForm: emptyLibranzaToReview,
      step: 1,
      dataReviewStatus: null,
      dataReviewNotes: null,
    }),

  addProducto: () =>
    set((state) => ({
      form: {
        ...state.form,
        productos: [
          ...state.form.productos,
          { codigo: "", descripcion: "", valor: "" },
        ],
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