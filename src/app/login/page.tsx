import { LoginForm } from "@/components/login-form";
import Image from "next/image";

export default function page() {
  return (
    <section className="w-dvw h-dvh  " style={{
      backgroundImage: "url('/home/bg-login.png')",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backdropFilter: "blur(10px)"
    }}>
      <div className="w-dvw h-dvh flex flex-col justify-center items-center gap-4" style={{
        backdropFilter: "blur(20px)"
      }}>
        <div className="flex flex-col gap-1 lg:flex-row ">
          <Image width={300} height={300} src='/home/Frugal.png' alt="Frugal"/>
          <Image width={220} height={190} src='/home/Watt.png' alt="Watt" className="mb-5"/>
        </div>
        <LoginForm className="bg-white rounded-2xl lg:w-2xl mx-4"/>
      </div>
    </section>
  );
}
