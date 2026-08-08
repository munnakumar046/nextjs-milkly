import { Card, CardContent } from "@/components/ui/card";

interface DashboardCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
}

export function DashboardCard({
  title,
  value,
  description,
  icon: Icon,
}: DashboardCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>

          <h2 className="mt-2 text-3xl font-bold">{value}</h2>

          <p className="mt-1 text-sm text-green-600">{description}</p>
        </div>

        <Icon className="h-10 w-10 text-primary" />
      </CardContent>
    </Card>
  );
}
