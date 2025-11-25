"use client"

import customToastAlert from "@/lib/customToastAlert";
import useLogout from "./useLogout";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

/**
 * Custom hook to handle Axios errors.
 * @returns { Function } - A function to handle Axios errors, which accepts `error` and `setError` as parameters.
**/

export default function useAxiosErrorHandler() {
	const logout = useLogout();
	const router = useRouter();

	/**
		* Error handler function.
		* @param {Object} error - The error object from Axios.
		* @param {Function} setError - Error setter function from react use-hook-form
	 */
	
	
	const axiosErrorHandler = useCallback((error, setError = () => {}) => {
		console.error(error);

		// Unauthenticated user
		if (error.status == 401) {
			logout();
		}else if(error.status == 403){
			customToastAlert("La demande que vous avez effectuée n'est pas autorisée.");
		}

		// Form Error
		else if (error.status == 422) {
			const erros = error.response?.data.errors;
			const errorKeys = Object.keys(erros);
			const errorMessages = Object.values(erros);

			errorKeys.map((errorKey, ind) => {
				setError(errorKey, {message: errorMessages[ind]})
			})
		
		// request not found
		}else if (error.status == 404) {
			customToastAlert("Page non trouvé");
			router.push(`/`);
		}

		// Too many requests
		else if (error.status == 429) {
			customToastAlert("Il semble que vous ayez envoyé trop de demandes.", "warning");
		}	
		
		// Server Error
		else if (error.status == 500) {
			customToastAlert("Server Error");
		}
		
		// Unexpected Error
		else {
			customToastAlert("Server Error", "warning");
		}
	}, [logout, router]);

	return axiosErrorHandler;
}