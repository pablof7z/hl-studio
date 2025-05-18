"use client";

// Using simple SVG icons instead of @tabler/icons-react
import type { NodeViewProps } from '@tiptap/core';
import { NodeViewWrapper } from '@tiptap/react';
import type { ImageAttributes } from 'nostr-editor';
import { DeleteButton } from "@/components/ui/atoms/DeleteButton";

/**
 * ImageEditor renders an image with upload status and controls.
 * It supports image uploads, alt text editing, and displays upload progress.
 */
export function ImageEditor(props: NodeViewProps) {
    const { src, alt, uploadUrl, uploading, uploadError } = props.node.attrs as ImageAttributes;
    const isUploaded = !src.startsWith('blob:http');
    
    return (
        <NodeViewWrapper
            data-drag-handle=""
            draggable={props.node.type.spec.draggable}
            className={`relative my-2 [&>img]:m-0 w-fit h-fit ${props.selected ? 'opacity-90' : ''}`}
        >
            <DeleteButton onClick={() => props.deleteNode()} />
            {uploading && <UploadingProgress />}
            <Image src={src} />
            <MediaFooter>
                {!isUploaded && <AltButton value={alt} onChange={(alt) => props.updateAttributes({ alt })} />}
                {!isUploaded && (
                    <UploadChip
                        uploadUrl={uploadUrl}
                        onChange={(uploadType, uploadUrl) => {
                            props.updateAttributes({ uploadType, uploadUrl });
                        }}
                    />
                )}
                {isUploaded && (
                    <span data-tooltip={src} className="p-1 flex flex-row justify-between rounded-full border border-white/20 bg-black text-green-300 text-xs right-2 bottom-2 z-50">
                        {/* Check icon */}
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </span>
                )}
                {uploadError && (
                    <span data-tooltip={uploadError} className="border border-white/20 bg-black rounded-full py-1 ml-1 text-red-500 relative top-0">
                        {/* X icon */}
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </span>
                )}
            </MediaFooter>
        </NodeViewWrapper>
    );
}

// Simple Image component
function Image({ src }: { src: string }) {
    return (
        <img 
            src={src} 
            alt="" 
            className="max-w-full rounded-md object-cover"
        />
    );
}

// AltButton component for editing alt text
function AltButton({ value, onChange }: { value: string; onChange: (value: string) => void }) {
    return (
        <button
            type="button"
            onClick={() => {
                const newAlt = prompt("Enter alt text for this image", value || "");
                if (newAlt !== null) {
                    onChange(newAlt);
                }
            }}
            className="px-2 py-1 text-xs bg-black/70 text-white rounded-full hover:bg-black/90 transition"
        >
            {value ? `Alt: ${value.substring(0, 15)}${value.length > 15 ? '...' : ''}` : 'Add alt text'}
        </button>
    );
}

// UploadChip component for selecting upload service
function UploadChip({ 
    uploadUrl, 
    onChange 
}: { 
    uploadUrl: string; 
    onChange: (uploadType: string, uploadUrl: string) => void 
}) {
    return (
        <div className="flex items-center ml-2">
            <select
                className="bg-black/70 text-white text-xs rounded-full px-2 py-1 border-none outline-none"
                value={uploadUrl}
                onChange={(e) => {
                    // For simplicity, we're using the same value for both uploadType and uploadUrl
                    // In a real implementation, you might have a mapping of types to URLs
                    onChange(e.target.value, e.target.value);
                }}
            >
                <option value="https://nostr.build">nostr.build</option>
                <option value="https://nostr.download">nostr.download</option>
                <option value="https://void.cat">void.cat</option>
            </select>
        </div>
    );
}

// UploadingProgress component
function UploadingProgress() {
    return (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 rounded-md">
            <div className="w-3/4 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                    className="bg-blue-600 h-2.5 rounded-full animate-pulse"
                    style={{ width: '75%' }}
                ></div>
            </div>
        </div>
    );
}

// MediaFooter component
function MediaFooter({ children }: { children: React.ReactNode }) {
    return (
        <div className="absolute bottom-2 left-2 flex flex-row items-center gap-2 z-10">
            {children}
        </div>
    );
}