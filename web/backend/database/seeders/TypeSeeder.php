<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TypeSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('types')->insert([
            ['name' => 'Math', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Physics', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Chemistry', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Biology', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Computer Science', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}