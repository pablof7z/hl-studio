import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlusIcon, Hash } from 'lucide-react';
import UserAvatar from '@/features/nostr/components/user/UserAvatar';

interface PublicationData {
    title: string;
    about: string;
    image: string;
    avatar: string;
    banner: string;
    category: string;
    hashtags: string[];
    authors: string[];
}

interface PublicationCardProps {
    publication: PublicationData;
}

export function PublicationCard({ publication }: PublicationCardProps) {
    return (
        <Card className="overflow-hidden h-[380px] w-[280px] flex flex-col relative p-4">
                {publication.banner ? (
                    <img
                        src={publication.banner}
                        alt="Publication banner"
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.nextElementSibling?.classList.remove('hidden');
                        }}
                    />
                ) : null}
                
                {/* Fallback gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 ${
                    publication.banner ? 'hidden' : ''
                }`} />
                
                {/* Dark overlay for better text readability */}
                <div className="absolute inset-0 bg-black/40" />

                <div className="w-full flex-1 z-10 flex items-center justify-center">
                    {/* Publication Avatar */}
                    {publication.avatar && (
                            <div className="w-24 h-24 object-cover rounded-full overflow-hidden border-2 border-white/50">
                                <img
                                    src={publication.avatar}
                                    alt={`${publication.title} avatar`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                    }}
                                />
                            </div>
                        )}
                </div>
                
                {/* Content */}
                <div className="relative z-10 flex flex-col items-start w-full gap-2">
                    {/* Top section - Category and Publication Avatar */}
                    <div className="flex justify-between items-start">
                        {/* Category Badge */}
                        {publication.category && (
                            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                                {publication.category}
                            </Badge>
                        )}
                    </div>
                    
                    {/* Middle section - Title and Description */}
                    <div className="flex flex-col items-start">
                        <div className="text-xl font-semibold text-white leading-tight">
                            {publication.title}
                        </div>
                        
                        {publication.about && (
                            <div className="text-white/90 text-sm leading-relaxed">
                                {publication.about}
                            </div>
                        )}
                    </div>
                    
                    {/* Hashtags */}
                    {publication.hashtags.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-2">
                            {publication.hashtags.slice(0, 3).map((hashtag, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center gap-1 px-2 py-1 bg-white/20 text-white text-xs rounded-full border border-white/30"
                                >
                                    <Hash className="w-3 h-3" />
                                    {hashtag}
                                </span>
                            ))}
                            {publication.hashtags.length > 3 && (
                                <span className="inline-flex items-center px-2 py-1 bg-white/20 text-white text-xs rounded-full border border-white/30">
                                    +{publication.hashtags.length - 3}
                                </span>
                            )}
                        </div>
                    )}
                    
                    {publication.authors.length > 1 && (
                        <div className="flex items-center -space-x-3">
                            {publication.authors.slice(0, 5).map((pubkey, index) => (
                                <UserAvatar key={pubkey} pubkey={pubkey} size="sm" />
                            ))}
                        </div>
                    )}
                    
                    <Button
                        variant="secondary"
                        size="lg"
                        className='w-full shadow-md'
                    >
                        <PlusIcon />
                        Add to Inbox
                    </Button>
                </div>
        </Card>
    );
}