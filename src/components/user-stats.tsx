import { Card, CardContent } from './ui/card'

export function UserStats() {
    return (
        <Card className="bg-card/70">
            <CardContent className="p-4 grid grid-cols-3 divide-x divide-border">
                <div className="text-center">
                    <p className="text-xs text-muted-foreground font-bold">SAVINGS</p>
                    <p className="text-xl font-bold text-foreground">₹1,240</p>
                </div>
                <div className="text-center">
                    <p className="text-xs text-muted-foreground font-bold">ACTIVE TASKS</p>
                    <p className="text-xl font-bold text-foreground">3</p>
                </div>
                <div className="text-center">
                    <p className="text-xs text-muted-foreground font-bold">SMART SCORE</p>
                    <p className="text-xl font-bold text-accent">92%</p>
                </div>
            </CardContent>
        </Card>
    )
}
