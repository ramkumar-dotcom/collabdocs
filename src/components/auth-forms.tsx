"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

const fieldClass =
  "h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/15";

const labelClass = "mb-1.5 block text-sm font-medium text-slate-700";

function PasswordInput({
  id,
  name,
  placeholder,
  autoComplete,
}: {
  id: string;
  name: string;
  placeholder: string;
  autoComplete: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={visible ? "text" : "password"}
        required
        minLength={8}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className={`${fieldClass} pr-12`}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute inset-y-0 right-0 px-3 text-xs font-semibold text-blue-600 hover:text-blue-700"
      >
        {visible ? "Hide" : "Show"}
      </button>
    </div>
  );
}

export function SignInForm() {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // UI only — auth API comes later
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate={false}>
      <div>
        <label htmlFor="email" className={labelClass}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@company.com"
          className={fieldClass}
        />
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label htmlFor="password" className="text-sm font-medium text-slate-700">
            Password
          </label>
          <button
            type="button"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            Forgot password?
          </button>
        </div>
        <PasswordInput
          id="password"
          name="password"
          placeholder="Enter your password"
          autoComplete="current-password"
        />
      </div>

      <label className="flex items-center gap-2.5 text-sm text-slate-600">
        <input
          type="checkbox"
          name="remember"
          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
        />
        Remember me for 7 days
      </label>

      <button
        type="submit"
        className="mt-2 inline-flex h-11 w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-sm font-semibold text-white shadow-md shadow-blue-600/25 transition hover:from-blue-500 hover:to-indigo-500"
      >
        Sign in
      </button>

      <p className="pt-2 text-center text-sm text-slate-500">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-blue-600 hover:text-blue-700"
        >
          Create one
        </Link>
      </p>
    </form>
  );
}

export function RegisterForm() {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // UI only — auth API comes later
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className={labelClass}>
          Full name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          placeholder="Ava Kim"
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="email" className={labelClass}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@company.com"
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="password" className={labelClass}>
          Password
        </label>
        <PasswordInput
          id="password"
          name="password"
          placeholder="At least 8 characters"
          autoComplete="new-password"
        />
      </div>

      <div>
        <label htmlFor="confirm" className={labelClass}>
          Confirm password
        </label>
        <PasswordInput
          id="confirm"
          name="confirm"
          placeholder="Re-enter your password"
          autoComplete="new-password"
        />
      </div>

      <label className="flex items-start gap-2.5 text-sm leading-5 text-slate-600">
        <input
          type="checkbox"
          name="terms"
          required
          className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
        />
        <span>
          I agree to the{" "}
          <span className="font-medium text-slate-800">Terms</span> and{" "}
          <span className="font-medium text-slate-800">Privacy Policy</span>
        </span>
      </label>

      <button
        type="submit"
        className="mt-2 inline-flex h-11 w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-sm font-semibold text-white shadow-md shadow-blue-600/25 transition hover:from-blue-500 hover:to-indigo-500"
      >
        Create account
      </button>

      <p className="pt-2 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-blue-600 hover:text-blue-700"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
