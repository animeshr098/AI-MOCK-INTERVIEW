import React, {ReactNode} from 'react'
import {IsAuthenticated} from "@/lib/actions/auth.action";
import {redirect} from "next/navigation";

const AuthLayout = async ({children} : {children: ReactNode}) => {
    const isUserAuthenticated = await IsAuthenticated();
    if(isUserAuthenticated) redirect('/');
    return (
        <div className="auth-layout">{children}</div>
    )
}
export default AuthLayout
