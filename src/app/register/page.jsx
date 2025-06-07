import RegisterForm from "@/components/registerForm";

const RegisterPage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        <p className="text-gray-600 mb-6">
          Silakan isi form berikut untuk mendaftar.
        </p>
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
