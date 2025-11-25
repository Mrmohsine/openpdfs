"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Spinner from "@/components/Spinner";
import { customAxios } from "@/axios/customAxios";
import { useSelector } from "react-redux";
import { useRouter } from 'next/navigation';
import { RootState } from '@/store/store';
import useAxiosErrorHandler from '@/hooks/useAxiosErrorHandler';

const userSchema = z.object({
    name: z.string().min(4, "Le nom de categorie doit contenir au moins 4 caractères").max(30, "Le nom ne doit pas dépasser 30 caractères"),
    description: z.string(),
});

type FormData = z.infer<typeof userSchema>

export default function Page() {
    const { token } = useSelector((store: RootState) => store.user);
    const { register, handleSubmit, setError, reset, setValue, formState: { errors, isSubmitting }, } = useForm<FormData>({ resolver: zodResolver(userSchema) });
    const router = useRouter();
    const axiosErrorHandler = useAxiosErrorHandler();

    async function onSubmit(data: {
        name: string,
        description: string,
    }) {
        const headers = { "Authorization": `Bearer ${token}` }
        
        try{
            await customAxios.post("documents", data, { headers })

            router.push(`../documents`);
        }catch(error) {
            axiosErrorHandler(error, setError);
        }
    }

    return (
        <div>
            
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 gap-4">
                    <div className="w-96">
                        <label className="text-sm font-medium">Nom categorie</label>
                        <input {...register("name")} type="text" className="input-3" />
                        {errors.name && <p className='error-1'>{errors.name.message}</p>}
                    </div>
                    
                    <div className="w-96">
                        <label className="text-sm font-medium">Description</label>
                        <textarea {...register("description")} onChange={e => setValue("description", e.target.value)} className='input-3'></textarea>
                        {errors.description && <p className='error-1'>{errors.description.message}</p>}
                    </div>
                </div>

                <div className="mt-4 flex gap-2 items-center">
                    <button className='btn-2' type="button" disabled={isSubmitting} onClick={() => reset()}>Rénitialiser</button>

                    <button disabled={isSubmitting} type='submit' className="btn-1 flex items-center gap-1">
                        {isSubmitting && <Spinner color="gray" size={12} />} Ajouter
                    </button>
                </div>

            </form>
        </div>
    )
}