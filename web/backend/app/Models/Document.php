<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    /** @use HasFactory<\Database\Factories\DocumentFactory> */
    use HasFactory;
    public function type()
    {
        return $this->belongsTo(\App\Models\Type::class);
    }
    public function user()
    {
        return $this->belongsTo(\App\Models\User::class);
    }
}
