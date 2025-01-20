// add the header component to the layout
import { Header } from "@/components/header";

export default function DashboardLayout({ children }) {
    return (
        <>
        <Header />
        {children}
        </>
    );
    }