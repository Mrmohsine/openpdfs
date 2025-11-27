<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DocumentSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('documents')->insert([
            [
                'title' => 'Algebra Basics',
                'description' => 'Introduction to algebra principles.',
                'keywords' => 'algebra, math, equations',
                'file_path' => 'documents/algebra.pdf',
                'file_original_name' => 'algebra.pdf',
                'user_id' => 1,    
                'type_id' => 1,    
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Quantum Physics Notes',
                'description' => 'Fundamentals of quantum mechanics.',
                'keywords' => 'quantum, physics, mechanics',
                'file_path' => 'documents/quantum.pdf',
                'file_original_name' => 'quantum.pdf',
                'user_id' => 1,
                'type_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}