import { useState, type ReactNode } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Controller, useForm, useWatch } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "react-toastify"
import { differenceInYears } from "date-fns"
import { AiOutlineLoading3Quarters } from "react-icons/ai"
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { signup } from "@/features/auth/auth.api"
import { getErrorMessage } from "@/lib/getErrorMessage"
import AuthShell from "@/components/myComponents/AuthShell"
import { FiEye, FiEyeOff } from "react-icons/fi"

const schema = z
  .object({
    name: z
      .string()
      .min(3, "At least 3 characters")
      .max(50, "Max 50 characters")
      .nonempty("Name is required"),
    username: z
      .string()
      .min(3, "At least 3 characters")
      .max(50, "Max 50 characters")
      .nonempty("Username is required"),
    email: z.email("Enter a valid email address").nonempty("Email is required"),
    dateOfBirth: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Pick your date of birth")
      .refine(
        (date) => new Date(date) < new Date(new Date().setHours(0, 0, 0, 0)),
        "Can't enter a future date"
      )
      .refine(
        (date) => differenceInYears(new Date(), new Date(date)) >= 18,
        "You must be at least 18 years old"
      ),
    gender: z.enum(["male", "female"]),
    password: z
      .string()
      .regex(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        "8+ characters with uppercase, lowercase, a number and a special character"
      ),
    rePassword: z.string(),
  })
  .refine((object) => object.password === object.rePassword, {
    error: "Passwords don't match",
    path: ["rePassword"],
  })
type RegisterValues = z.infer<typeof schema>

function Row({
  id,
  label,
  error,
  children,
}: {
  id: string
  label: string
  error?: string
  children: ReactNode
}) {
  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      {children}
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </Field>
  )
}

export default function RegisterForm() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm<RegisterValues>({
    defaultValues: {
      name: "",
      username: "",
      email: "",
      dateOfBirth: "",
      gender: "male",
      password: "",
      rePassword: "",
    },
    mode: "onTouched",
    resolver: zodResolver(schema),
  })

  const passwordValue = useWatch({
    control,
    name: "password",
  })

  const rePasswordValue = useWatch({
    control,
    name: "rePassword",
  })

  async function handleRegister(values: RegisterValues) {
    try {
      setIsLoading(true)
      const response = await signup(values)
      if (response.success) {
        toast.success(response.message)
        navigate("/login")
      }
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthShell
      title="Create your account"
      sub="It takes under a minute."
      foot={
        <>
          Already a member?{" "}
          <Link
            to="/login"
            className="font-semibold text-violet-600 hover:underline"
          >
            Login
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(handleRegister)} noValidate>
        <FieldSet>
          <FieldGroup className="gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Row id="name" label="Name" error={errors.name?.message}>
                <Input
                  id="name"
                  className="h-11"
                  autoComplete="name"
                  aria-invalid={!!errors.name}
                  {...register("name")}
                />
              </Row>
              <Row
                id="username"
                label="Username"
                error={errors.username?.message}
              >
                <Input
                  id="username"
                  className="h-11"
                  autoComplete="username"
                  aria-invalid={!!errors.username}
                  {...register("username")}
                />
              </Row>
            </div>
            <Row id="email" label="Email" error={errors.email?.message}>
              <Input
                id="email"
                type="email"
                className="h-11"
                autoComplete="email"
                placeholder="you@example.com"
                aria-invalid={!!errors.email}
                {...register("email")}
              />
            </Row>
            <div className="grid gap-4 sm:grid-cols-2">
              <Row
                id="dob"
                label="Date of birth"
                error={errors.dateOfBirth?.message}
              >
                <Input
                  id="dob"
                  type="date"
                  className="h-11"
                  aria-invalid={!!errors.dateOfBirth}
                  {...register("dateOfBirth")}
                />
              </Row>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Row
                    id="gender"
                    label="Gender"
                    error={errors.gender?.message}
                  >
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="flex h-11 items-center gap-5"
                    >
                      {(["male", "female"] as const).map((gender) => (
                        <div key={gender} className="flex items-center gap-2">
                          <RadioGroupItem value={gender} id={gender} />
                          <Label htmlFor={gender} className="capitalize">
                            {gender}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </Row>
                )}
              />
            </div>
            <Row
              id="password"
              label="Password"
              error={errors.password?.message}
            >
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
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
            </Row>
            <Row
              id="rePassword"
              label="Confirm password"
              error={errors.rePassword?.message}
            >
              <div className="relative">
                <Input
                  id="rePassword"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Confirm password"
                  aria-invalid={!!errors.rePassword}
                  className="h-11 pr-11"
                  {...register("rePassword")}
                />
                {rePasswordValue && (
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
            </Row>
          </FieldGroup>
          <Button
            type="submit"
            disabled={isLoading}
            className="h-11 w-full cursor-pointer bg-violet-600 font-semibold hover:bg-violet-700 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <AiOutlineLoading3Quarters className="animate-spin" />
            ) : (
              "Create account"
            )}
          </Button>
        </FieldSet>
      </form>
    </AuthShell>
  )
}
