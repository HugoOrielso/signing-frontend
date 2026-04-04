import { z } from "zod";

function toNumber(value: string): number {
    const normalized = String(value ?? "")
        .replace(/\s/g, "")
        .replace(/,/g, ".");
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : 0;
}

const phoneSchema = z
    .string()
    .trim()
    .regex(/^3\d{9}$/, "El teléfono debe ser colombiano, de 10 dígitos e iniciar en 3");

const moneyStringSchema = z
    .string()
    .trim()
    .min(1, "Este campo es obligatorio")
    .refine((value) => toNumber(value) > 0, {
        message: "Debe ser un valor mayor a 0",
    });

const optionalEmailSchema = z
    .union([
        z.literal(""),
        z.string().trim().email("Correo inválido"),
    ])
    .optional();

export const tipoContratoSchema = z.enum([
    "PROVISIONAL",
    "TEMPORAL",
    "PROVISIONAL_VACANTE_DEFINITIVA",
    "CARRERA_ADMINISTRATIVA",
    "PENSIONADO",
]);

export const productoSchema = z.object({
    codigo: z.string().trim().min(1, "El código es obligatorio"),
    descripcion: z.string().trim().min(1, "La descripción es obligatoria"),
    valor: moneyStringSchema,
});

export const referenceSchema = z
    .object({
        type: z.enum(["PERSONAL", "LABORAL"]),

        name: z.string().trim().min(1, "El nombre es obligatorio"),

        phone: phoneSchema,

        email: optionalEmailSchema,

        company: z.string().trim().optional(),
        position: z.string().trim().optional(),

        relationShip: z.string().trim().optional(),
    })
    .superRefine((ref, ctx) => {
        if (ref.type === "PERSONAL" && !ref.relationShip?.trim()) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "El parentesco es obligatorio",
                path: ["relationShip"],
            });
        }
    });

export const libranzaFormSchema = z
    .object({
        ciudad: z.string().trim().min(1, "Ciudad requerida"),
        asesor: z.string().trim().min(1, "Asesor requerido"),
        fecha: z.string().trim().min(1, "La fecha es obligatoria"),

        clienteNombre: z.string().trim().min(1, "El nombre del cliente es obligatorio"),
        clienteCC: z.string().trim().min(1, "La cédula es obligatoria"),
        clienteCCDe: z.string().trim().min(1, "La ciudad de expedición es obligatoria"),
        clienteDireccion: z.string().trim().min(1, "La dirección es obligatoria"),
        clienteTelefono: phoneSchema,
        clienteEmail: z.string().trim().email("Email inválido"),
        clienteFuncionario: z.string().trim().min(1, "La empresa del funcionario es obligatoria"),
        clienteDesdeHace: z.string().trim().min(1, "Este campo es obligatorio"),

        clienteFechaNacimiento: z
            .string()
            .trim()
            .min(1, "La fecha de nacimiento es obligatoria")
            .refine((value) => parseDateString(value) !== null, {
                message: "La fecha de nacimiento no es válida",
            })
            .refine((value) => {
                const age = calculateAgeFromString(value);
                return age !== null && age >= 18 && age <= 65;
            }, {
                message: "No se puede realizar la libranza: la edad permitida es entre 18 y 65 años",
            }),

        clienteFechaExpedicionCC: z
            .string()
            .trim()
            .min(1, "La fecha de expedición es obligatoria")
            .refine((value) => !Number.isNaN(new Date(value).getTime()), {
                message: "La fecha de expedición no es válida",
            }),

        municipioTrabajo: z.string().trim().min(1, "El municipio es obligatorio"),
        empresaTrabajo: z.string().trim().min(1, "La empresa o entidad es obligatoria"),
        departamento: z.string().trim().min(1, "El departamento es obligatorio"),

        pagaduriaNombre: z.string().trim().min(1, "La pagaduría es obligatoria"),
        pagaduriaMunicipio: z.string().trim().min(1, "El municipio de pagaduría es obligatorio"),
        pagaduriaDepartamento: z.string().trim().min(1, "El departamento de pagaduría es obligatorio"),

        tipoContrato: tipoContratoSchema,

        sumaTotal: moneyStringSchema,
        numeroCuotas: z
            .string()
            .trim()
            .min(1, "El número de cuotas es obligatorio")
            .refine((value) => {
                const num = Number(value);
                return Number.isInteger(num);
            }, {
                message: "Debe ser un número entero",
            })
            .refine((value) => {
                const num = Number(value);
                return num >= 10 && num <= 22;
            }, {
                message: "El número de cuotas debe estar entre 10 y 22",
            }),

        valorCuota: moneyStringSchema,
        mesCobro: z.string().trim().min(1, "El mes de cobro es obligatorio"),

        tipoCuenta: z.enum(["Ahorros", "Corriente"], {
            message: "Debe seleccionar un tipo de cuenta",
        }),
        numeroCuenta: z.string().trim().min(1, "El número de cuenta es obligatorio"),
        banco: z.string().trim().min(1, "El banco es obligatorio"),

        productos: z
            .array(productoSchema)
            .min(1, "Debe ingresar al menos un producto"),

        references: z
            .array(referenceSchema)
            .length(2, "Debes ingresar una referencia personal y una laboral")
            .refine((refs) => {
                const types = refs.map((r) => r.type);
                return types.includes("PERSONAL") && types.includes("LABORAL");
            }, {
                message: "Debe existir una referencia personal y una laboral",
            }),

        formaPago: z.enum(["NOMINA", "EFECTY 110520", "PSE", "BANCO"], {
            message: "Debe seleccionar una forma de pago",
        }),

        destinatarioEmail: z.string().trim().email("Correo del destinatario inválido"),
        destinatarioNombre: z.string().trim().min(1, "El nombre del destinatario es obligatorio"),

        templateKey: z.string().trim().min(1, "El template es obligatorio"),
    })
    .superRefine((data, ctx) => {
        const birthDate = new Date(data.clienteFechaNacimiento);
        const expeditionDate = new Date(data.clienteFechaExpedicionCC);
        const today = new Date();

        if (!Number.isNaN(expeditionDate.getTime()) && !Number.isNaN(birthDate.getTime())) {
            if (expeditionDate < birthDate) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "La fecha de expedición no puede ser anterior a la fecha de nacimiento",
                    path: ["clienteFechaExpedicionCC"],
                });
            }
        }

        if (!Number.isNaN(expeditionDate.getTime()) && expeditionDate > today) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "La fecha de expedición no puede ser futura",
                path: ["clienteFechaExpedicionCC"],
            });
        }

        const personalRef = data.references.find((r) => r.type === "PERSONAL");
        const laboralRef = data.references.find((r) => r.type === "LABORAL");

        if (!personalRef) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Debe existir una referencia personal",
                path: ["references"],
            });
        }

        if (!laboralRef) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Debe existir una referencia laboral",
                path: ["references"],
            });
        }

        if (personalRef && laboralRef && personalRef.phone === laboralRef.phone) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Las referencias no pueden tener el mismo número",
                path: ["references", 0, "phone"],
            });

            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Las referencias no pueden tener el mismo número",
                path: ["references", 1, "phone"],
            });
        }

        data.references.forEach((ref, index) => {
            if (ref.phone === data.clienteTelefono) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "La referencia no puede tener el mismo teléfono del cliente",
                    path: ["references", index, "phone"],
                });
            }
        });

        const totalProductos = data.productos.reduce((sum, producto) => {
            return sum + toNumber(producto.valor);
        }, 0);

        const sumaTotal = toNumber(data.sumaTotal);
        const numeroCuotas = toNumber(data.numeroCuotas);
        const valorCuota = toNumber(data.valorCuota);

        if (Math.abs(totalProductos - sumaTotal) > 0.01) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "La suma total no coincide con el total de los productos",
                path: ["sumaTotal"],
            });
        }

        if (numeroCuotas > 0) {
            const cuotaCalculada = sumaTotal / numeroCuotas;

            if (Math.abs(cuotaCalculada - valorCuota) > 1) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "El valor de la cuota no coincide con la suma total dividida entre el número de cuotas",
                    path: ["valorCuota"],
                });
            }
        }
    });

export type LibranzaFormValidated = z.infer<typeof libranzaFormSchema>;


function parseDateString(value: string): Date | null {
    if (!value) return null;

    // formato YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        const [year, month, day] = value.split("-").map(Number);
        const date = new Date(year, month - 1, day);

        if (
            date.getFullYear() !== year ||
            date.getMonth() !== month - 1 ||
            date.getDate() !== day
        ) {
            return null;
        }

        return date;
    }

    // formato DD/MM/YYYY
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
        const [day, month, year] = value.split("/").map(Number);
        const date = new Date(year, month - 1, day);

        if (
            date.getFullYear() !== year ||
            date.getMonth() !== month - 1 ||
            date.getDate() !== day
        ) {
            return null;
        }

        return date;
    }

    return null;
}

function calculateAgeFromString(value: string): number | null {
    const birthDate = parseDateString(value);
    if (!birthDate) return null;

    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
        age--;
    }

    return age;
}