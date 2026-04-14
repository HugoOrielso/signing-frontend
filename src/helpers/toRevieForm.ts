import { LibranzaForm } from "@/types/libranza";

export type LibranzaReviewForm = Omit<LibranzaForm, "templateKey">;

export function toReviewForm(form: LibranzaForm): LibranzaReviewForm {
  const { templateKey, ...rest } = form;
  return rest;
}