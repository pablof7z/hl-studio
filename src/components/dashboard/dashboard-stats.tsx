import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, DollarSign, TrendingUp, Users } from 'lucide-react';

export function DashboardStats() {
    const stats = [
        {
            title: 'Total Subscribers',
            value: '2,845',
            icon: Users,
            change: '+12.5%',
            trend: 'up',
        },
        {
            title: 'Total Posts',
            value: '48',
            icon: BookOpen,
            change: '+4.3%',
            trend: 'up',
        },
        {
            title: 'Engagement Rate',
            value: '24.8%',
            icon: TrendingUp,
            change: '+2.1%',
            trend: 'up',
        },
        {
            title: 'Revenue',
            value: '$4,289',
            icon: DollarSign,
            change: '+18.2%',
            trend: 'up',
        },
    ];

    return (
        <>
            {stats.map((stat, index) => (
                <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                        <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <p className={`text-xs ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                            {stat.change} from last month
                        </p>
                    </CardContent>
                </Card>
            ))}
        </>
    );
}
