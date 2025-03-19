export interface Empleado {
    id?: number;
    dni: string;
    first_name: string;
    last_name: string;
    email: string;
    password?:string;
    status: 'A' | 'I';
    position_id: number,
    salary: number,
    documentos?: Documento[]
}

export interface Documento {
    id: number;
    value: any;
}



