import { SubmitHandler, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

interface IFormLogin {
  id: number
  password: string
}

export default function Login() {
  const { handleSubmit, register } = useForm<IFormLogin>()
  const onSubmit: SubmitHandler<IFormLogin> = (data) => console.log(data);
  
  return (
    <>
      <form 
        action='/auth/login'
        onSubmit={handleSubmit(onSubmit)}>
        <input {...register("id", { required: true, maxLength: 20, minLength: 6})}/>
        <input type='password' {...register("password", { required: true })} />
        <input type="submit" value="로그인" />
      </form>
      <Link to="/register">회원가입</Link>
    </>
  );
}
