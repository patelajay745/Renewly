import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useGetDashboardStats } from "@/hooks/api/use-dashboard";
import { Spinner } from "./ui/spinner";

export default function DashboardPage() {
    const { data, isLoading } = useGetDashboardStats();



    if (isLoading)
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spinner />
            </div>
        )
    if (isLoading)
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spinner />
            </div>
        );

    if (!data) return null;

    return (
        <div className=" p-2 space-y-8">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Subscriptions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-semibold">
                            {data.stats.totalSubscriptions}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Users With Subscriptions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-semibold">
                            {data.stats.totalUsersWithSubscriptions}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Notifications Enabled</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-semibold">
                            {data.stats.notifications.subscriptionsWithNotificationsEnabled}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Expo Tokens</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-semibold">
                            {data.stats.notifications.subscriptionsWithExpoToken}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Queue Status</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-5 text-center">
                        {Object.entries(data.queue).map(([key, value]) => (
                            <div key={key}>
                                <p className="text-sm text-muted-foreground capitalize">
                                    {key}
                                </p>
                                <p className="text-2xl font-semibold">{value}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Users</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Subscriptions</TableHead>
                                <TableHead>Notifications</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {data.users.map((u) => (
                                <TableRow key={u.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={u.image} alt={u.name} />
                                            </Avatar>
                                            {u.name}
                                        </div>
                                    </TableCell>

                                    <TableCell>{u.email}</TableCell>
                                    <TableCell>{u.subscriptionCount}</TableCell>
                                    <TableCell>{u.enabledNotifications}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}