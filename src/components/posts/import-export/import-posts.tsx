'use client';

import { ImportPreview } from '@/components/posts/import-export/import-preview';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, CheckCircle, FileText, FileUp } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';

export function ImportPosts() {
    const [importSource, setImportSource] = useState<string>('file');
    const [fileSelected, setFileSelected] = useState<boolean>(false);
    const [fileName, setFileName] = useState<string>('');
    const [importStage, setImportStage] = useState<'initial' | 'preview' | 'importing' | 'complete' | 'error'>(
        'initial'
    );
    const [progress, setProgress] = useState<number>(0);
    const [importOptions, setImportOptions] = useState({
        preserveDates: true,
        importAsDrafts: false,
        includeImages: true,
    });

    // Mock data for preview
    const previewData = [
        {
            title: 'How to Build a Successful Newsletter',
            status: 'Published',
            publishDate: '2023-05-15',
            wordCount: 1245,
        },
        {
            title: 'The Ultimate Guide to Content Creation',
            status: 'Published',
            publishDate: '2023-06-22',
            wordCount: 2134,
        },
        {
            title: '10 Ways to Grow Your Audience',
            status: 'Draft',
            lastUpdated: '2023-07-10',
            wordCount: 1876,
        },
        {
            title: 'Monetization Strategies for Creators',
            status: 'Published',
            publishDate: '2023-08-05',
            wordCount: 1543,
        },
        {
            title: 'Building a Personal Brand Online',
            status: 'Draft',
            lastUpdated: '2023-09-01',
            wordCount: 1298,
        },
    ];

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setFileSelected(true);
            setFileName(files[0].name);
        } else {
            setFileSelected(false);
            setFileName('');
        }
    };

    const handleImportClick = () => {
        if (importStage === 'initial') {
            setImportStage('preview');
        } else if (importStage === 'preview') {
            setImportStage('importing');
            // Simulate import progress
            let currentProgress = 0;
            const interval = setInterval(() => {
                currentProgress += 10;
                setProgress(currentProgress);
                if (currentProgress >= 100) {
                    clearInterval(interval);
                    setImportStage('complete');
                }
            }, 500);
        }
    };

    const resetImport = () => {
        setImportStage('initial');
        setFileSelected(false);
        setFileName('');
        setProgress(0);
    };

    return (
        <div className="space-y-6">
            {importStage === 'initial' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Import Content</CardTitle>
                        <CardDescription>Import your content from other platforms or from a file</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label>Import Source</Label>
                            <Select value={importSource} onValueChange={setImportSource}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select import source" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="file">File Upload (JSON, CSV, Markdown)</SelectItem>
                                    <SelectItem value="substack">Substack</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="wordpress">WordPress</SelectItem>
                                    <SelectItem value="ghost">Ghost</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {importSource === 'file' ? (
                            <div className="space-y-4">
                                <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-md p-8">
                                    <FileUp className="h-10 w-10 text-muted-foreground mb-4" />
                                    <div className="space-y-2 text-center">
                                        <h3 className="font-medium">Upload your file</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Drag and drop or click to upload
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Supports JSON, CSV, and Markdown files
                                        </p>
                                    </div>
                                    <div className="mt-4 relative">
                                        <input
                                            type="file"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            accept=".json,.csv,.md,.zip"
                                            onChange={handleFileChange}
                                        />
                                        <Button variant="outline">Select File</Button>
                                    </div>
                                    {fileSelected && (
                                        <div className="mt-4 flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">{fileName}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-sm font-medium">Import Options</h3>
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="preserveDates"
                                                checked={importOptions.preserveDates}
                                                onCheckedChange={(checked) =>
                                                    setImportOptions({
                                                        ...importOptions,
                                                        preserveDates: checked === true,
                                                    })
                                                }
                                            />
                                            <Label htmlFor="preserveDates">Preserve original publish dates</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="importAsDrafts"
                                                checked={importOptions.importAsDrafts}
                                                onCheckedChange={(checked) =>
                                                    setImportOptions({
                                                        ...importOptions,
                                                        importAsDrafts: checked === true,
                                                    })
                                                }
                                            />
                                            <Label htmlFor="importAsDrafts">Import all posts as drafts</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="includeImages"
                                                checked={importOptions.includeImages}
                                                onCheckedChange={(checked) =>
                                                    setImportOptions({
                                                        ...importOptions,
                                                        includeImages: checked === true,
                                                    })
                                                }
                                            />
                                            <Label htmlFor="includeImages">Include images and attachments</Label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <Alert>
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Platform integration</AlertTitle>
                                    <AlertDescription>
                                        You&amp;apos;ll need to authorize Highlighter to access your {importSource}{' '}
                                        account.
                                    </AlertDescription>
                                </Alert>
                                <Button>Connect {importSource}</Button>
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button variant="outline">Cancel</Button>
                        <Button onClick={handleImportClick} disabled={importSource === 'file' && !fileSelected}>
                            Continue to Preview
                        </Button>
                    </CardFooter>
                </Card>
            )}

            {importStage === 'preview' && (
                <ImportPreview data={previewData} onImport={handleImportClick} onCancel={resetImport} />
            )}

            {importStage === 'importing' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Importing Content</CardTitle>
                        <CardDescription>Please wait while we import your content</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Progress value={progress} className="h-2 w-full" />
                        <p className="text-center text-sm text-muted-foreground">
                            Importing {previewData.length} posts ({progress}% complete)
                        </p>
                    </CardContent>
                </Card>
            )}

            {importStage === 'complete' && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            Import Complete
                        </CardTitle>
                        <CardDescription>Your content has been successfully imported</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="rounded-md bg-muted p-4">
                            <div className="text-sm font-medium">Import Summary</div>
                            <ul className="mt-2 text-sm">
                                <li>Total posts imported: {previewData.length}</li>
                                <li>Published posts: {previewData.filter((p) => p.status === 'Published').length}</li>
                                <li>Draft posts: {previewData.filter((p) => p.status === 'Draft').length}</li>
                            </ul>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button variant="outline" onClick={resetImport}>
                            Import More Content
                        </Button>
                        <Button>View Imported Posts</Button>
                    </CardFooter>
                </Card>
            )}
        </div>
    );
}
