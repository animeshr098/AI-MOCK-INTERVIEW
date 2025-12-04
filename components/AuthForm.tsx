"use client"
import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from 'firebase/auth'
import {auth} from '@/firebase/client'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Image from "next/image";
import Link from "next/link";
import {toast} from "sonner";
import FormField from "@/components/FormField";
import {useRouter} from "next/navigation";
import {signIn, signUp} from "@/lib/actions/auth.action";
const AuthformSchema = (type : FormType) => {
    return z.object(
        {
            name : (type === 'sign-up' ? z.string().min(3, {message:"Name must be at least 3 characters."}) : z.string()),
            email : z.string().min(1, {message:"Email is required."}).email({message:"Invalid email"}),
            password: z.string().min(8, {message:"Password must be at least 8 characters"}),
        }
    );
}

const AuthForm = ({type} : {type : FormType}) => {
    // 1. Define your form.
    const router = useRouter();
    const formSchema = AuthformSchema(type);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            if(type === 'sign-in') {
                const {email, password} = values;
                const userCredentials = await signInWithEmailAndPassword(auth, email, password);
                const idToken = await userCredentials.user.getIdToken();
                if(!idToken) {
                    toast.error('Signed In failed');
                    return;
                }
                await signIn({
                    email, idToken
                })
                toast.success("Signed In successfully.");
                router.push("/");
            } else {
                const {name, email, password} = values;
                const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
                const result = await signUp({
                    uid: userCredentials.user.uid,
                    name:name!,
                    email,
                    password,
                })
                if(!result?.success) {
                    toast.error(result?.message);
                    return;
                }
                toast.success("Account created successfully. Please sign in.");
                router.push("/sign-in");
            }
        } catch(error) {
            console.error(error);
            toast.error(`There was an error ${error}`);
        }
    }
    let isSignin = (type === "sign-in");
    return (
        <div className="card-border lg:min-w-[556px]">
            <div className="flex flex-col gap-6 card py-14 px-10">
                <div className="flex flex-row gap-2 justify-center">
                    <Image src="/logo.svg" alt="logo" height={32} width={38} />
                    <h2 className="text-primary-100">PrepWise</h2>
                </div>
                <h3 className = "text-center">Practice JOB Interview with AI</h3>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt-4 form">
                        {!isSignin && (
                            <FormField control={form.control} name="name" label="Name" placeholder="Your Name"/>
                        )}
                        <FormField control={form.control} name="email" label="Email" placeholder="Your email address" type="email"/>
                        <FormField control={form.control} name="password" label="Password" placeholder="Enter your password" type="password"/>
                        <Button className="btn" type="submit">{isSignin ? 'Sign in' : 'Create an Account'}</Button>
                    </form>
                </Form>
                <p className="text-center">
                    {isSignin ? 'No Account yet ?' : 'Have an account already?'}
                    <Link href={isSignin ? "/sign-up" : '/sign-in'} className = "font-bold text-user-primary ml-1">
                        {isSignin ? "Sign up" : "Sign in"}
                    </Link>
                </p>
            </div>
        </div>
    )
}
export default AuthForm
