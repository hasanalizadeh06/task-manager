import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormData, LoginSchema } from "../schemas/login";

export const useLoginForm = () =>
  useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
  });

// usage
// const { register, handleSubmit, formState: { errors } } = useLoginForm();
