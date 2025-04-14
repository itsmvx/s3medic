<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    protected function logoutOtherGuards(string $currentGuard): void
    {
        foreach (['admin', 'pelanggan'] as $guard) {
            if ($guard !== $currentGuard && Auth::guard($guard)->check()) {
                Auth::guard($guard)->logout();
                session()->invalidate();
                session()->regenerateToken();
            }
        }
    }

    public function authAdmin(Request $request): JsonResponse
    {
        $validation = Validator::make($request->only(['username', 'password']), [
            'username' => 'required|string',
            'password' => 'required|string'
        ]);

        if ($validation->fails()) {
            return Response::json([
                'message' => $validation->errors()->first()
            ], 422);
        }

        if (Auth::guard('admin')->attempt($request->only('username', 'password'))) {
            $this->logoutOtherGuards('admin');
            $admin = Auth::guard('admin')->user();

            return Response::json([
                'message' => 'Login berhasil',
                'data' => [
                    'id' => $admin->id,
                    'nama' => $admin->nama,
                    'username' => $admin->username ?? null,
                ],
                'role' => 'admin'
            ]);
        } else {
            return Response::json([
                'message' => 'Username atau password salah'
            ], 401);
        }
    }
    /**
     * @throws ValidationException
     */
    public function authPelanggan(Request $request): JsonResponse
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string|min:6'
        ]);
        $this->logoutOtherGuards('pelanggan');
        if (Auth::guard('pelanggan')->attempt($request->only('username', 'password'))) {
            $pelanggan = Auth::guard('pelanggan')->user();

            return Response::json([
                'message' => 'Login berhasil',
                'data' => [
                    'id' => $pelanggan->id,
                    'nama' => $pelanggan->nama,
                    'username' => $pelanggan->username,
                ],
                'role' => 'pelanggan'
            ]);
        } else {
            return Response::json([
                'message' => 'Username atau password salah'
            ], 401);
        }
    }
    public function logout(Request $request): JsonResponse
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Response::json([
            'message' => 'Logout berhasil!',
        ]);
    }
}
