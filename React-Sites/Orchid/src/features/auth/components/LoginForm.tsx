import { useContext, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm, useWatch } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "react-toastify"
import { AiOutlineLoading3Quarters } from "react-icons/ai"
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { login } from "@/features/auth/auth.api"
import { AuthContext } from "@/context/AuthContext/authContext"
import { getErrorMessage } from "@/lib/getErrorMessage"
import AuthShell from "@/components/myComponents/AuthShell"
import { FiEye, FiEyeOff } from "react-icons/fi"

const schema = z.object({
  email: z.email("Enter a valid email address").nonempty("Email is required"),
  password: z
    .string()
    .regex(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
      "8+ characters with uppercase, lowercase, a number and a special character"
    ),
})
type LoginValues = z.infer<typeof schema>

const Err = ({ msg }: { msg?: string }) =>
  msg ? (
    <p role="alert" className="text-sm text-destructive">
      {msg}
    </p>
  ) : null

export default function LoginForm() {
  const navigate = useNavigate()
  const { setToken } = useContext(AuthContext)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
  } = useForm<LoginValues>({
    mode: "onTouched",
    resolver: zodResolver(schema),
  })

  // show eye icon when typing
  const passwordValue = useWatch({
    control,
    name: "password",
  })

  async function handleLogin(values: LoginValues) {
    try {
      setIsLoading(true)
      const response = await login(values)
      if (response.success) {
        if (response.data?.token) {
          setToken(response.data.token)
          localStorage.setItem("token", response.data.token)
        }
        toast.success(response.message)
        navigate("/posts") // after the token is stored
      }
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      sub="Login to see what's new."
      foot={
        <>
          New here?{" "}
          <Link
            to="/register"
            className="font-semibold text-violet-600 hover:underline"
          >
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(handleLogin)} noValidate>
        <FieldSet>
          <FieldGroup className="gap-4">
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                className="h-11"
                placeholder="you@example.com"
                aria-invalid={!!errors.email}
                {...register("email")}
              />
              {errors.email?.message && <Err msg={errors.email?.message} />}
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Your password"
                  aria-invalid={!!errors.password}
                  className="h-11 pr-11"
                  {...register("password")}
                />
                {passwordValue && (
                  <button
                    type="button"
                    onClick={() => setShowPassword((show) => !show)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute inset-y-0 right-0 grid w-11 place-items-center text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                )}
              </div>
              {errors.password?.message && (
                <Err msg={errors.password?.message} />
              )}
            </Field>
          </FieldGroup>
          <Button
            type="submit"
            disabled={isLoading}
            className="h-11 w-full cursor-pointer bg-violet-600 font-semibold hover:bg-violet-700 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <AiOutlineLoading3Quarters className="animate-spin" />
            ) : (
              "Login"
            )}
          </Button>
        </FieldSet>
      </form>
    </AuthShell>
  )
}
{
  /* <PasswordInput
    id="password"
    autoComplete="current-password"
    placeholder="Your password"
    aria-invalid={!!errors.password}
    {...register("password")}
  /> */
}
