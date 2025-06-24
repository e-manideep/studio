'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AIInsightsCard } from "./AIInsightsCard";
import { ChatCard } from "./ChatCard";
import { useAppContext } from "@/hooks/useAppContext";

export function AssistantPanel() {
    const { expenses, budget, savingsGoals } = useAppContext();
    return (
        <Tabs defaultValue="insights" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="insights">AI Insights</TabsTrigger>
                <TabsTrigger value="chat">Chat</TabsTrigger>
            </TabsList>
            <TabsContent value="insights">
                <AIInsightsCard expenses={expenses} budget={budget} savingsGoals={savingsGoals} />
            </TabsContent>
            <TabsContent value="chat">
                <ChatCard />
            </TabsContent>
        </Tabs>
    )
}
