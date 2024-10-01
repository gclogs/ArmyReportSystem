import { SubmitHandler, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

interface IFormRegister {
  id: number
  password: string
  name: string
  role: string
  email: string
}

export default function Register() {
  const { handleSubmit, register } = useForm<IFormRegister>()
  const onSubmit: SubmitHandler<IFormRegister> = (data) => console.log(data);
  
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("id", { required: true, minLength: 8, maxLength: 16 })} />
        <input type='password' {...register("password", { required: true, minLength: 8, maxLength: 24 })} />
        <input {...register("email", { required: true,  maxLength: 24, pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/ })} />
        <input {...register("role", { required: true, minLength: 2, maxLength: 16 })} />
        <input {...register("name", { required: true, minLength: 2, maxLength: 16 })} />
        <input type="submit" value="회원가입" />
      </form>
      <Link to="/login">로그인</Link>
    </>
  );
}
