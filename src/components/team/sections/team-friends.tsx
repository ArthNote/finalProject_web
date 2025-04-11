"use client";

import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getFriends,
  getFriendRequests,
  sendFriendRequest,
  respondToFriendRequest,
  cancelFriendRequest,
  deleteFriendship,
  searchUsers,
} from "@/lib/api/friends";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Users2,
  UserPlus,
  Clock,
  Search as SearchIcon,
  MoreHorizontal,
  UserX,
  MessageSquare,
  User,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Friend, FriendRequest, SearchUserResult } from "@/types/friend";
import EmptyState from "@/components/empty_state";
import { UserPlus2, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { authClient } from "@/lib/auth-client";

// Add this helper function at the top of the file, before the component
function isRequestData(
  data:
    | Friend[]
    | SearchUserResult[]
    | { received: FriendRequest[]; sent: FriendRequest[] }
): data is { received: FriendRequest[]; sent: FriendRequest[] } {
  return !Array.isArray(data) && "received" in data;
}

// Add these type guard functions near the top
function isSearchResult(
  data: Friend | SearchUserResult
): data is SearchUserResult {
  return "name" in data && !("receiver" in data);
}

function isFriend(data: Friend | SearchUserResult): data is Friend {
  return "receiver" in data;
}

const TeamFriends = () => {
  const t = useTranslations("friends");
  const [friendsSearchQuery, setFriendsSearchQuery] = useState("");
  const [currentTab, setCurrentTab] = useState("friends");
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userSearchLoading, setUserSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchUserResult[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<{
    username: string;
    email: string;
    image: string;
  } | null>(null);
  const queryClient = useQueryClient();
  const { data } = authClient.useSession();

  const searchUsersDebounced = useDebouncedCallback(async (query: string) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }

    setUserSearchLoading(true);
    try {
      const response = await searchUsers(query);
      if (response.success && Array.isArray(response.data)) {
        setSearchResults(response.data as SearchUserResult[]);
      }
    } catch (error) {
      console.error("Error searching users:", error);
      toast({
        title: t("toast.errorSearch.title"),
        description: t("toast.errorSearch.description"),
        variant: "destructive",
      });
    } finally {
      setUserSearchLoading(false);
    }
  }, 300);

  // Queries
  const { data: friendsData, isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getFriends,
  });

  const { data: requestsData, isLoading: loadingRequests } = useQuery({
    queryKey: ["friend-requests"],
    queryFn: getFriendRequests,
  });

  // Mutations
  const { mutate: sendRequest } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => {
      toast({
        title: t("toast.requestSent.title"),
        description: t("toast.requestSent.description"),
      });
      // Refresh both friends and requests queries
      queryClient.refetchQueries({ queryKey: ["friends"], type: "all" });
      queryClient.refetchQueries({
        queryKey: ["friend-requests"],
        type: "all",
      });
      setShowAddFriend(false);
    },
    onError: () => {
      toast({
        title: t("toast.errorSendRequest.title"),
        description: t("toast.errorSendRequest.description"),
        variant: "destructive",
      });
    },
  });

  const { mutate: respondToRequest } = useMutation({
    mutationFn: respondToFriendRequest,
    onSuccess: (res, action) => {
      if (action.action === "accept") {
        toast({
          title: t("toast.requestAccepted.title"),
          description: t("toast.requestAccepted.description"),
        });
      } else {
        toast({
          title: t("toast.requestDeclined.title"),
          description: t("toast.requestDeclined.description"),
        });
      }

      // Refresh both friends and requests queries
      queryClient.refetchQueries({ queryKey: ["friends"], type: "all" });
      queryClient.refetchQueries({
        queryKey: ["friend-requests"],
        type: "all",
      });
    },
    onError: () => {
      toast({
        title: t("toast.errorRequestResponse.title"),
        description: t("toast.errorRequestResponse.description"),
        variant: "destructive",
      });
    },
  });

  const { mutate: cancelRequest } = useMutation({
    mutationFn: cancelFriendRequest,
    onSuccess: () => {
      toast({
        title: t("toast.requestCancelled.title"),
        description: t("toast.requestCancelled.description"),
      });
      // Refresh both friends and requests queries
      queryClient.refetchQueries({ queryKey: ["friends"], type: "all" });
      queryClient.refetchQueries({
        queryKey: ["friend-requests"],
        type: "all",
      });
    },
    onError: () => {
      toast({
        title: t("toast.errorCancelRequest.title"),
        description: t("toast.errorCancelRequest.description"),
        variant: "destructive",
      });
    },
  });

  const { mutate: removeFriend } = useMutation({
    mutationFn: deleteFriendship,
    onSuccess: () => {
      toast({
        title: t("toast.friendRemoved.title"),
        description: t("toast.friendRemoved.description"),
      });
      // Refresh both friends and requests queries
      queryClient.refetchQueries({ queryKey: ["friends"], type: "all" });
      queryClient.refetchQueries({
        queryKey: ["friend-requests"],
        type: "all",
      });
    },
    onError: () => {
      toast({
        title: t("toast.errorRemoveFriend.title"),
        description: t("toast.errorRemoveFriend.description"),
        variant: "destructive",
      });
    },
  });

  // Handlers
  const handleAcceptRequest = (friendshipId: string) => {
    respondToRequest({ friendshipId, action: "accept" });
  };

  const handleRejectRequest = (friendshipId: string) => {
    respondToRequest({ friendshipId, action: "reject" });
  };

  const handleCancelRequest = (friendshipId: string) => {
    cancelRequest(friendshipId);
  };

  const handleRemoveFriend = (friendshipId: string) => {
    removeFriend(friendshipId);
  };

  const getOtherUser = (friend: Friend) => {
    // Return the other user's data (not the current user)
    const myUserId = data?.user.id;
    return friend.sender.id === myUserId
      ? friend.receiver
      : friend.sender;
  };

  const renderFriendItem = (friend: Friend) => {
    const otherUser = getOtherUser(friend);
    return (
      <div key={friend.id}>
        <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={otherUser.image || undefined} />
              <AvatarFallback>{otherUser.username[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{otherUser.username}</p>
              <p className="text-sm text-muted-foreground">
                @{otherUser.username}
              </p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSelectedProfile(otherUser)}>
                <User className="h-4 w-4 mr-2" />
                {t("friendsList.friend.viewProfile")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  /* TODO: Implement messaging */
                }}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                {t("friendsList.friend.message")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleRemoveFriend(friend.id)}
                className="text-red-600"
              >
                <UserX className="h-4 w-4 mr-2" />
                {t("friendsList.friend.removeFriend")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  };

  const filterFriends = (friend: Friend, searchQuery: string) => {
    const query = searchQuery.toLowerCase();
    const otherUser = getOtherUser(friend);
    return (
      otherUser.username.toLowerCase().includes(query) ||
      otherUser.email.toLowerCase().includes(query)
    );
  };

  const filterRequests = (request: FriendRequest, searchQuery: string) => {
    const query = searchQuery.toLowerCase();
    const target = request.receiver || request.sender;
    return (
      target.username.toLowerCase().includes(query) ||
      target.email.toLowerCase().includes(query)
    );
  };

  const getActionButton = (user: SearchUserResult) => {
    if (user.friendshipStatus === "accepted") {
      return (
        <Button size="sm" variant="secondary" disabled>
          {t("addDialog.alreadyFriends")}
        </Button>
      );
    }

    if (user.hasPendingRequest) {
      return (
        <Button size="sm" variant="secondary" disabled>
          {t("addDialog.requestSent")}
        </Button>
      );
    }

    if (user.friendshipStatus === "pending") {
      return (
        <Button size="sm" variant="secondary" disabled>
          {t("addDialog.pendingResponse")}
        </Button>
      );
    }

    return (
      <Button size="sm" variant="default" onClick={() => sendRequest(user.id)}>
        {t("addDialog.addFriend")}
      </Button>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users2 className="h-5 w-5" />
                {t("title")}
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddFriend(true)}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                {t("addFriend")}
              </Button>
            </div>
          </CardHeader>

          {/* Add Friend Dialog */}
          <Dialog open={showAddFriend} onOpenChange={setShowAddFriend}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("addDialog.title")}</DialogTitle>
                <DialogDescription>
                  {t("addDialog.description")}
                </DialogDescription>
              </DialogHeader>

              <div className="relative">
                <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("addDialog.searchPlaceholder")}
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    searchUsersDebounced(e.target.value);
                  }}
                />
              </div>

              <div className="mt-4 space-y-4 max-h-[300px] overflow-y-auto">
                {userSearchLoading ? (
                  <div className="text-center text-sm text-muted-foreground">
                    {t("addDialog.searching")}
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="space-y-2">
                    {searchResults.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-2 hover:bg-muted rounded-md"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={user.image} />
                            <AvatarFallback>{user.username[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{user.name}</p>
                            <p className="text-xs text-muted-foreground">
                              @{user.username}
                            </p>
                          </div>
                        </div>
                        {getActionButton(user)}
                      </div>
                    ))}
                  </div>
                ) : searchQuery ? (
                  <div className="text-center text-sm text-muted-foreground">
                    {t("addDialog.noUsersFound")}
                  </div>
                ) : (
                  <div className="text-center text-sm text-muted-foreground">
                    {t("addDialog.searchUsers")}
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>

          <CardContent>
            <div className="relative mb-6">
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t("searchPeople")}
                value={friendsSearchQuery}
                onChange={(e) => setFriendsSearchQuery(e.target.value)}
                className="w-full pl-9"
              />
            </div>

            <Tabs value={currentTab} onValueChange={setCurrentTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="friends">
                  <Users2 className="h-4 w-4 mr-2" />
                  {t("tabs.friends")}
                  {friendsData?.data && Array.isArray(friendsData.data) && (
                    <Badge variant="secondary" className="ml-2">
                      {friendsData.data.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="pending">
                  <Clock className="h-4 w-4 mr-2" />
                  {t("tabs.pending")}
                  {requestsData?.data && isRequestData(requestsData.data) && (
                    <Badge variant="secondary" className="ml-2">
                      {requestsData.data.received.length +
                        requestsData.data.sent.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="friends" className="space-y-1">
                {loadingFriends ? (
                  <div className="text-center py-4">
                    {t("friendsList.loadingFriends")}
                  </div>
                ) : friendsData?.data && Array.isArray(friendsData.data) ? (
                  friendsData.data.length > 0 ? (
                    friendsData.data.filter(
                      (friend): friend is Friend =>
                        isFriend(friend) &&
                        filterFriends(friend, friendsSearchQuery)
                    ).length > 0 ? (
                      friendsData.data
                        .filter(
                          (friend): friend is Friend =>
                            isFriend(friend) &&
                            filterFriends(friend, friendsSearchQuery)
                        )
                        .map((friend) => renderFriendItem(friend))
                    ) : (
                      <EmptyState
                        icon={
                          <SearchIcon className="h-10 w-10 text-muted-foreground" />
                        }
                        title={t("friendsList.searchEmpty.title")}
                        description={t("friendsList.searchEmpty.description", {
                          query: friendsSearchQuery,
                        })}
                      />
                    )
                  ) : (
                    <EmptyState
                      icon={
                        <Users className="h-10 w-10 text-muted-foreground" />
                      }
                      title={t("friendsList.noFriends.title")}
                      description={t("friendsList.noFriends.description")}
                      action={t("friendsList.noFriends.action")}
                      actionHandler={() => setShowAddFriend(true)}
                    />
                  )
                ) : (
                  <EmptyState
                    icon={<Users className="h-10 w-10 text-muted-foreground" />}
                    title={t("friendsList.errorLoading.title")}
                    description={t("friendsList.errorLoading.description")}
                  />
                )}
              </TabsContent>

              <TabsContent value="pending" className="space-y-4">
                {loadingRequests ? (
                  <div className="text-center py-4">
                    {t("pendingList.loadingRequests")}
                  </div>
                ) : requestsData?.data && isRequestData(requestsData.data) ? (
                  requestsData.data.received.length > 0 ||
                  requestsData.data.sent.length > 0 ? (
                    requestsData.data.received.filter((request) =>
                      filterRequests(request, friendsSearchQuery)
                    ).length === 0 &&
                    requestsData.data.sent.filter((request) =>
                      filterRequests(request, friendsSearchQuery)
                    ).length === 0 ? (
                      <EmptyState
                        icon={
                          <SearchIcon className="h-10 w-10 text-muted-foreground" />
                        }
                        title={t("pendingList.searchEmpty.title")}
                        description={t("pendingList.searchEmpty.description", {
                          query: friendsSearchQuery,
                        })}
                      />
                    ) : (
                      <>
                        {requestsData.data.received.filter((request) =>
                          filterRequests(request, friendsSearchQuery)
                        ).length > 0 && (
                          <>
                            <div className="text-sm font-medium text-muted-foreground mb-2">
                              {t("pendingList.received", {
                                count: requestsData.data.received.filter(
                                  (request) =>
                                    filterRequests(request, friendsSearchQuery)
                                ).length,
                              })}
                            </div>
                            {requestsData.data.received
                              .filter((request) =>
                                filterRequests(request, friendsSearchQuery)
                              )
                              .map((request) => (
                                <div
                                  key={request.id}
                                  className="flex items-center justify-between p-2 rounded-lg hover:bg-muted"
                                >
                                  <div className="flex items-center gap-3">
                                    <Avatar>
                                      <AvatarImage
                                        src={request.sender.image || undefined}
                                      />
                                      <AvatarFallback>
                                        {request.sender.username[0]}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p className="font-medium">
                                        {request.sender.username}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {t("pendingList.sentYouARequest")}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button
                                      variant="default"
                                      size="sm"
                                      onClick={() =>
                                        handleAcceptRequest(request.id)
                                      }
                                    >
                                      {t("pendingList.accept")}
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        handleRejectRequest(request.id)
                                      }
                                    >
                                      {t("pendingList.decline")}
                                    </Button>
                                  </div>
                                </div>
                              ))}
                          </>
                        )}

                        {requestsData.data.sent.filter((request) =>
                          filterRequests(request, friendsSearchQuery)
                        ).length > 0 && (
                          <>
                            <div className="text-sm font-medium text-muted-foreground mb-2 mt-6">
                              {t("pendingList.sent", {
                                count: requestsData.data.sent.filter(
                                  (request) =>
                                    filterRequests(request, friendsSearchQuery)
                                ).length,
                              })}
                            </div>
                            {requestsData.data.sent
                              .filter((request) =>
                                filterRequests(request, friendsSearchQuery)
                              )
                              .map((request) => (
                                <div
                                  key={request.id}
                                  className="flex items-center justify-between p-2 rounded-lg hover:bg-muted"
                                >
                                  <div className="flex items-center gap-3">
                                    <Avatar>
                                      <AvatarImage
                                        src={
                                          request.receiver?.image || undefined
                                        }
                                      />
                                      <AvatarFallback>
                                        {request.receiver?.username[0]}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p className="font-medium">
                                        {request.receiver?.username}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {t("pendingList.requestSent")}
                                      </p>
                                    </div>
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      handleCancelRequest(request.id)
                                    }
                                  >
                                    {t("pendingList.cancel")}
                                  </Button>
                                </div>
                              ))}
                          </>
                        )}

                        {requestsData.data.received.filter((request) =>
                          filterRequests(request, friendsSearchQuery)
                        ).length === 0 &&
                          requestsData.data.sent.filter((request) =>
                            filterRequests(request, friendsSearchQuery)
                          ).length === 0 && (
                            <div className="text-center text-sm text-muted-foreground py-4">
                              {t("pendingList.noRequestsMatch")}
                            </div>
                          )}
                      </>
                    )
                  ) : (
                    <EmptyState
                      icon={
                        <UserPlus2 className="h-10 w-10 text-muted-foreground" />
                      }
                      title={t("pendingList.noPendingRequests.title")}
                      description={t(
                        "pendingList.noPendingRequests.description"
                      )}
                      action={t("pendingList.noPendingRequests.action")}
                      actionHandler={() => setShowAddFriend(true)}
                    />
                  )
                ) : (
                  <EmptyState
                    icon={
                      <UserPlus2 className="h-10 w-10 text-muted-foreground" />
                    }
                    title={t("pendingList.errorLoading.title")}
                    description={t("pendingList.errorLoading.description")}
                  />
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Profile Dialog */}
      <Dialog
        open={!!selectedProfile}
        onOpenChange={() => setSelectedProfile(null)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("profileDialog.title")}</DialogTitle>
          </DialogHeader>
          {selectedProfile && (
            <div className="flex flex-col items-center gap-4 py-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={selectedProfile.image || undefined} />
                <AvatarFallback>{selectedProfile.username[0]}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-center gap-2">
                <h3 className="text-lg font-semibold">
                  {selectedProfile.username}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {selectedProfile.email}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamFriends;
