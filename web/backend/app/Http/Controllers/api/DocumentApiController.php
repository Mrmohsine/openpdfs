<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DocumentApiController extends Controller
{
    /**
     * GET /api/documents
     * Paginated list of documents with related type and user.
     */
    
    public function index(Request $request)
    {
        $perPage = (int) $request->query('per_page', 10);
        $documents = Document::with(['type', 'user'])->paginate($perPage);

        $documents->getCollection()->transform(function ($doc) {
            if ($doc->file_path) {
                $doc->file_url = url(Storage::url($doc->file_path));
            } else {
                $doc->file_url = null;
            }
            return $doc;
        });

        return response()->json([
            'status' => true,
            'per_page' => $documents->perPage(),
            'current_page' => $documents->currentPage(),
            'total' => $documents->total(),
            'documents' => $documents->items(), 
        ]);
    }

    /**
     * GET /api/documents/{document}
     * Show single document with type and user.
     */
    public function show(Document $document)
    {
        $document->load(['type', 'user']);

        // add public url
        $document->file_url = $document->file_path ? Storage::url($document->file_path) : null;

        return response()->json([
            'status' => true,
            'document' => $document,
        ]);
    }

    /**
     * GET /api/documents/type/{type_id}
     * Return all documents for a given type (with type and user).
     */
    public function byType($type_id)
    {
        $docs = Document::where('type_id', $type_id)
                        ->with(['type', 'user'])
                        ->get();

        $docs->transform(function ($doc) {
            $doc->file_url = $doc->file_path ? Storage::url($doc->file_path) : null;
            return $doc;
        });

        return response()->json([
            'status' => true,
            'count' => $docs->count(),
            'documents' => $docs,
        ]);
    }

    /**
     * GET /api/documents/search/{query}
     * Search documents by title (case-insensitive partial match).
     */
    public function search($query)
    {
        $docs = Document::where('title', 'like', "%{$query}%")
                        ->with(['type', 'user'])
                        ->get();

        $docs->transform(function ($doc) {
            $doc->file_url = $doc->file_path ? Storage::url($doc->file_path) : null;
            return $doc;
        });

        return response()->json([
            'status' => true,
            'count' => $docs->count(),
            'documents' => $docs,
        ]);
    }
}