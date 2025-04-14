<?php

namespace App\Http\Controllers;

use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

abstract class Controller
{
    public function getViewPerPage(Request $request)
    {
        $viewList = [ "15", "30", "50", "100" ];
        $viewPerPage = $request->query('view');

        if (!in_array($viewPerPage, $viewList)) {
            return $viewPerPage = 15;
        } else {
            return $viewPerPage = intval($viewPerPage);
        }

    }
    public function queryExceptionResponse(QueryException $exception)
    {
        return Response::json([
            'message' => config('app.debug')
                ? $exception->getMessage()
                : 'Server gagal memproses permintaan'
        ], 500);
    }
}
