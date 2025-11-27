<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\DocumentApiController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// specific routes first
Route::get('/documents/type/{type_id}', [DocumentApiController::class, 'byType']);
Route::get('/documents/search/{query}', [DocumentApiController::class, 'search']);

// list (paginated)
Route::get('/documents', [DocumentApiController::class, 'index'])->name('api.documents.index');

// show single document (numeric id only)
Route::get('/documents/{document}', [DocumentApiController::class, 'show'])
     ->whereNumber('document')->name('api.documents.show');