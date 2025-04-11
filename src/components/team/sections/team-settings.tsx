"use client";

import { useTeam } from "../team-context";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const TeamSettings = () => {
  const { team } = useTeam();

  return (
    <div className="space-y-6">
      {/* Team Profile */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Team Profile</h3>
          <p className="text-sm text-muted-foreground">
            Update your team information and settings
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Team Name</label>
            <Input defaultValue={team.name} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Input defaultValue={team.description} />
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      {/* Subscription Settings */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Subscription</h3>
          <p className="text-sm text-muted-foreground">
            Manage your team subscription and billing
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2">
            <div>
              <p className="font-medium">{team.plan.name}</p>
              <p className="text-sm text-muted-foreground">
                {team.memberCount} of {team.plan.memberLimit} members
              </p>
            </div>
            <Button variant="outline" className="w-full sm:w-auto">
              Manage Subscription
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Danger Zone</h3>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete Team</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete team?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete your team and all its data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamSettings;
