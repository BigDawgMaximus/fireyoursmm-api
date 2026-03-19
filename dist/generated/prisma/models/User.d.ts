import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model User
 *
 */
export type UserModel = runtime.Types.Result.DefaultSelection<Prisma.$UserPayload>;
export type AggregateUser = {
    _count: UserCountAggregateOutputType | null;
    _avg: UserAvgAggregateOutputType | null;
    _sum: UserSumAggregateOutputType | null;
    _min: UserMinAggregateOutputType | null;
    _max: UserMaxAggregateOutputType | null;
};
export type UserAvgAggregateOutputType = {
    credits_remaining: number | null;
    credits_monthly: number | null;
    onboarding_step: number | null;
};
export type UserSumAggregateOutputType = {
    credits_remaining: number | null;
    credits_monthly: number | null;
    onboarding_step: number | null;
};
export type UserMinAggregateOutputType = {
    id: string | null;
    email: string | null;
    password_hash: string | null;
    name: string | null;
    created_at: Date | null;
    updated_at: Date | null;
    stripe_customer_id: string | null;
    plan: string | null;
    credits_remaining: number | null;
    credits_monthly: number | null;
    credits_reset_at: Date | null;
    onboarding_complete: boolean | null;
    onboarding_step: number | null;
    vault_path: string | null;
    timezone: string | null;
    brief_time: string | null;
    priority_platform: string | null;
    reset_token: string | null;
    reset_token_expiry: Date | null;
    referral_code: string | null;
    referred_by: string | null;
};
export type UserMaxAggregateOutputType = {
    id: string | null;
    email: string | null;
    password_hash: string | null;
    name: string | null;
    created_at: Date | null;
    updated_at: Date | null;
    stripe_customer_id: string | null;
    plan: string | null;
    credits_remaining: number | null;
    credits_monthly: number | null;
    credits_reset_at: Date | null;
    onboarding_complete: boolean | null;
    onboarding_step: number | null;
    vault_path: string | null;
    timezone: string | null;
    brief_time: string | null;
    priority_platform: string | null;
    reset_token: string | null;
    reset_token_expiry: Date | null;
    referral_code: string | null;
    referred_by: string | null;
};
export type UserCountAggregateOutputType = {
    id: number;
    email: number;
    password_hash: number;
    name: number;
    created_at: number;
    updated_at: number;
    stripe_customer_id: number;
    plan: number;
    credits_remaining: number;
    credits_monthly: number;
    credits_reset_at: number;
    onboarding_complete: number;
    onboarding_step: number;
    vault_path: number;
    timezone: number;
    brief_time: number;
    priority_platform: number;
    reset_token: number;
    reset_token_expiry: number;
    referral_code: number;
    referred_by: number;
    _all: number;
};
export type UserAvgAggregateInputType = {
    credits_remaining?: true;
    credits_monthly?: true;
    onboarding_step?: true;
};
export type UserSumAggregateInputType = {
    credits_remaining?: true;
    credits_monthly?: true;
    onboarding_step?: true;
};
export type UserMinAggregateInputType = {
    id?: true;
    email?: true;
    password_hash?: true;
    name?: true;
    created_at?: true;
    updated_at?: true;
    stripe_customer_id?: true;
    plan?: true;
    credits_remaining?: true;
    credits_monthly?: true;
    credits_reset_at?: true;
    onboarding_complete?: true;
    onboarding_step?: true;
    vault_path?: true;
    timezone?: true;
    brief_time?: true;
    priority_platform?: true;
    reset_token?: true;
    reset_token_expiry?: true;
    referral_code?: true;
    referred_by?: true;
};
export type UserMaxAggregateInputType = {
    id?: true;
    email?: true;
    password_hash?: true;
    name?: true;
    created_at?: true;
    updated_at?: true;
    stripe_customer_id?: true;
    plan?: true;
    credits_remaining?: true;
    credits_monthly?: true;
    credits_reset_at?: true;
    onboarding_complete?: true;
    onboarding_step?: true;
    vault_path?: true;
    timezone?: true;
    brief_time?: true;
    priority_platform?: true;
    reset_token?: true;
    reset_token_expiry?: true;
    referral_code?: true;
    referred_by?: true;
};
export type UserCountAggregateInputType = {
    id?: true;
    email?: true;
    password_hash?: true;
    name?: true;
    created_at?: true;
    updated_at?: true;
    stripe_customer_id?: true;
    plan?: true;
    credits_remaining?: true;
    credits_monthly?: true;
    credits_reset_at?: true;
    onboarding_complete?: true;
    onboarding_step?: true;
    vault_path?: true;
    timezone?: true;
    brief_time?: true;
    priority_platform?: true;
    reset_token?: true;
    reset_token_expiry?: true;
    referral_code?: true;
    referred_by?: true;
    _all?: true;
};
export type UserAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: Prisma.UserWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Users to fetch.
     */
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.UserWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Users from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Users.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType;
};
export type GetUserAggregateType<T extends UserAggregateArgs> = {
    [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateUser[P]> : Prisma.GetScalarType<T[P], AggregateUser[P]>;
};
export type UserGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithAggregationInput | Prisma.UserOrderByWithAggregationInput[];
    by: Prisma.UserScalarFieldEnum[] | Prisma.UserScalarFieldEnum;
    having?: Prisma.UserScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: UserCountAggregateInputType | true;
    _avg?: UserAvgAggregateInputType;
    _sum?: UserSumAggregateInputType;
    _min?: UserMinAggregateInputType;
    _max?: UserMaxAggregateInputType;
};
export type UserGroupByOutputType = {
    id: string;
    email: string;
    password_hash: string;
    name: string | null;
    created_at: Date;
    updated_at: Date;
    stripe_customer_id: string | null;
    plan: string;
    credits_remaining: number;
    credits_monthly: number;
    credits_reset_at: Date;
    onboarding_complete: boolean;
    onboarding_step: number;
    vault_path: string | null;
    timezone: string;
    brief_time: string;
    priority_platform: string | null;
    reset_token: string | null;
    reset_token_expiry: Date | null;
    referral_code: string | null;
    referred_by: string | null;
    _count: UserCountAggregateOutputType | null;
    _avg: UserAvgAggregateOutputType | null;
    _sum: UserSumAggregateOutputType | null;
    _min: UserMinAggregateOutputType | null;
    _max: UserMaxAggregateOutputType | null;
};
type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<UserGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], UserGroupByOutputType[P]> : Prisma.GetScalarType<T[P], UserGroupByOutputType[P]>;
}>>;
export type UserWhereInput = {
    AND?: Prisma.UserWhereInput | Prisma.UserWhereInput[];
    OR?: Prisma.UserWhereInput[];
    NOT?: Prisma.UserWhereInput | Prisma.UserWhereInput[];
    id?: Prisma.StringFilter<"User"> | string;
    email?: Prisma.StringFilter<"User"> | string;
    password_hash?: Prisma.StringFilter<"User"> | string;
    name?: Prisma.StringNullableFilter<"User"> | string | null;
    created_at?: Prisma.DateTimeFilter<"User"> | Date | string;
    updated_at?: Prisma.DateTimeFilter<"User"> | Date | string;
    stripe_customer_id?: Prisma.StringNullableFilter<"User"> | string | null;
    plan?: Prisma.StringFilter<"User"> | string;
    credits_remaining?: Prisma.IntFilter<"User"> | number;
    credits_monthly?: Prisma.IntFilter<"User"> | number;
    credits_reset_at?: Prisma.DateTimeFilter<"User"> | Date | string;
    onboarding_complete?: Prisma.BoolFilter<"User"> | boolean;
    onboarding_step?: Prisma.IntFilter<"User"> | number;
    vault_path?: Prisma.StringNullableFilter<"User"> | string | null;
    timezone?: Prisma.StringFilter<"User"> | string;
    brief_time?: Prisma.StringFilter<"User"> | string;
    priority_platform?: Prisma.StringNullableFilter<"User"> | string | null;
    reset_token?: Prisma.StringNullableFilter<"User"> | string | null;
    reset_token_expiry?: Prisma.DateTimeNullableFilter<"User"> | Date | string | null;
    referral_code?: Prisma.StringNullableFilter<"User"> | string | null;
    referred_by?: Prisma.StringNullableFilter<"User"> | string | null;
    competitors?: Prisma.CompetitorListRelationFilter;
    platforms?: Prisma.UserPlatformListRelationFilter;
    chat_messages?: Prisma.ChatMessageListRelationFilter;
    generated_content?: Prisma.GeneratedContentListRelationFilter;
    experiments?: Prisma.ExperimentLogListRelationFilter;
    rewards?: Prisma.RewardListRelationFilter;
    referrals_made?: Prisma.ReferralListRelationFilter;
};
export type UserOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    password_hash?: Prisma.SortOrder;
    name?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    stripe_customer_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    plan?: Prisma.SortOrder;
    credits_remaining?: Prisma.SortOrder;
    credits_monthly?: Prisma.SortOrder;
    credits_reset_at?: Prisma.SortOrder;
    onboarding_complete?: Prisma.SortOrder;
    onboarding_step?: Prisma.SortOrder;
    vault_path?: Prisma.SortOrderInput | Prisma.SortOrder;
    timezone?: Prisma.SortOrder;
    brief_time?: Prisma.SortOrder;
    priority_platform?: Prisma.SortOrderInput | Prisma.SortOrder;
    reset_token?: Prisma.SortOrderInput | Prisma.SortOrder;
    reset_token_expiry?: Prisma.SortOrderInput | Prisma.SortOrder;
    referral_code?: Prisma.SortOrderInput | Prisma.SortOrder;
    referred_by?: Prisma.SortOrderInput | Prisma.SortOrder;
    competitors?: Prisma.CompetitorOrderByRelationAggregateInput;
    platforms?: Prisma.UserPlatformOrderByRelationAggregateInput;
    chat_messages?: Prisma.ChatMessageOrderByRelationAggregateInput;
    generated_content?: Prisma.GeneratedContentOrderByRelationAggregateInput;
    experiments?: Prisma.ExperimentLogOrderByRelationAggregateInput;
    rewards?: Prisma.RewardOrderByRelationAggregateInput;
    referrals_made?: Prisma.ReferralOrderByRelationAggregateInput;
};
export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    email?: string;
    stripe_customer_id?: string;
    reset_token?: string;
    referral_code?: string;
    AND?: Prisma.UserWhereInput | Prisma.UserWhereInput[];
    OR?: Prisma.UserWhereInput[];
    NOT?: Prisma.UserWhereInput | Prisma.UserWhereInput[];
    password_hash?: Prisma.StringFilter<"User"> | string;
    name?: Prisma.StringNullableFilter<"User"> | string | null;
    created_at?: Prisma.DateTimeFilter<"User"> | Date | string;
    updated_at?: Prisma.DateTimeFilter<"User"> | Date | string;
    plan?: Prisma.StringFilter<"User"> | string;
    credits_remaining?: Prisma.IntFilter<"User"> | number;
    credits_monthly?: Prisma.IntFilter<"User"> | number;
    credits_reset_at?: Prisma.DateTimeFilter<"User"> | Date | string;
    onboarding_complete?: Prisma.BoolFilter<"User"> | boolean;
    onboarding_step?: Prisma.IntFilter<"User"> | number;
    vault_path?: Prisma.StringNullableFilter<"User"> | string | null;
    timezone?: Prisma.StringFilter<"User"> | string;
    brief_time?: Prisma.StringFilter<"User"> | string;
    priority_platform?: Prisma.StringNullableFilter<"User"> | string | null;
    reset_token_expiry?: Prisma.DateTimeNullableFilter<"User"> | Date | string | null;
    referred_by?: Prisma.StringNullableFilter<"User"> | string | null;
    competitors?: Prisma.CompetitorListRelationFilter;
    platforms?: Prisma.UserPlatformListRelationFilter;
    chat_messages?: Prisma.ChatMessageListRelationFilter;
    generated_content?: Prisma.GeneratedContentListRelationFilter;
    experiments?: Prisma.ExperimentLogListRelationFilter;
    rewards?: Prisma.RewardListRelationFilter;
    referrals_made?: Prisma.ReferralListRelationFilter;
}, "id" | "email" | "stripe_customer_id" | "reset_token" | "referral_code">;
export type UserOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    password_hash?: Prisma.SortOrder;
    name?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    stripe_customer_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    plan?: Prisma.SortOrder;
    credits_remaining?: Prisma.SortOrder;
    credits_monthly?: Prisma.SortOrder;
    credits_reset_at?: Prisma.SortOrder;
    onboarding_complete?: Prisma.SortOrder;
    onboarding_step?: Prisma.SortOrder;
    vault_path?: Prisma.SortOrderInput | Prisma.SortOrder;
    timezone?: Prisma.SortOrder;
    brief_time?: Prisma.SortOrder;
    priority_platform?: Prisma.SortOrderInput | Prisma.SortOrder;
    reset_token?: Prisma.SortOrderInput | Prisma.SortOrder;
    reset_token_expiry?: Prisma.SortOrderInput | Prisma.SortOrder;
    referral_code?: Prisma.SortOrderInput | Prisma.SortOrder;
    referred_by?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.UserCountOrderByAggregateInput;
    _avg?: Prisma.UserAvgOrderByAggregateInput;
    _max?: Prisma.UserMaxOrderByAggregateInput;
    _min?: Prisma.UserMinOrderByAggregateInput;
    _sum?: Prisma.UserSumOrderByAggregateInput;
};
export type UserScalarWhereWithAggregatesInput = {
    AND?: Prisma.UserScalarWhereWithAggregatesInput | Prisma.UserScalarWhereWithAggregatesInput[];
    OR?: Prisma.UserScalarWhereWithAggregatesInput[];
    NOT?: Prisma.UserScalarWhereWithAggregatesInput | Prisma.UserScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"User"> | string;
    email?: Prisma.StringWithAggregatesFilter<"User"> | string;
    password_hash?: Prisma.StringWithAggregatesFilter<"User"> | string;
    name?: Prisma.StringNullableWithAggregatesFilter<"User"> | string | null;
    created_at?: Prisma.DateTimeWithAggregatesFilter<"User"> | Date | string;
    updated_at?: Prisma.DateTimeWithAggregatesFilter<"User"> | Date | string;
    stripe_customer_id?: Prisma.StringNullableWithAggregatesFilter<"User"> | string | null;
    plan?: Prisma.StringWithAggregatesFilter<"User"> | string;
    credits_remaining?: Prisma.IntWithAggregatesFilter<"User"> | number;
    credits_monthly?: Prisma.IntWithAggregatesFilter<"User"> | number;
    credits_reset_at?: Prisma.DateTimeWithAggregatesFilter<"User"> | Date | string;
    onboarding_complete?: Prisma.BoolWithAggregatesFilter<"User"> | boolean;
    onboarding_step?: Prisma.IntWithAggregatesFilter<"User"> | number;
    vault_path?: Prisma.StringNullableWithAggregatesFilter<"User"> | string | null;
    timezone?: Prisma.StringWithAggregatesFilter<"User"> | string;
    brief_time?: Prisma.StringWithAggregatesFilter<"User"> | string;
    priority_platform?: Prisma.StringNullableWithAggregatesFilter<"User"> | string | null;
    reset_token?: Prisma.StringNullableWithAggregatesFilter<"User"> | string | null;
    reset_token_expiry?: Prisma.DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null;
    referral_code?: Prisma.StringNullableWithAggregatesFilter<"User"> | string | null;
    referred_by?: Prisma.StringNullableWithAggregatesFilter<"User"> | string | null;
};
export type UserCreateInput = {
    id?: string;
    email: string;
    password_hash: string;
    name?: string | null;
    created_at?: Date | string;
    updated_at?: Date | string;
    stripe_customer_id?: string | null;
    plan?: string;
    credits_remaining?: number;
    credits_monthly?: number;
    credits_reset_at?: Date | string;
    onboarding_complete?: boolean;
    onboarding_step?: number;
    vault_path?: string | null;
    timezone?: string;
    brief_time?: string;
    priority_platform?: string | null;
    reset_token?: string | null;
    reset_token_expiry?: Date | string | null;
    referral_code?: string | null;
    referred_by?: string | null;
    competitors?: Prisma.CompetitorCreateNestedManyWithoutUserInput;
    platforms?: Prisma.UserPlatformCreateNestedManyWithoutUserInput;
    chat_messages?: Prisma.ChatMessageCreateNestedManyWithoutUserInput;
    generated_content?: Prisma.GeneratedContentCreateNestedManyWithoutUserInput;
    experiments?: Prisma.ExperimentLogCreateNestedManyWithoutUserInput;
    rewards?: Prisma.RewardCreateNestedManyWithoutUserInput;
    referrals_made?: Prisma.ReferralCreateNestedManyWithoutReferrerInput;
};
export type UserUncheckedCreateInput = {
    id?: string;
    email: string;
    password_hash: string;
    name?: string | null;
    created_at?: Date | string;
    updated_at?: Date | string;
    stripe_customer_id?: string | null;
    plan?: string;
    credits_remaining?: number;
    credits_monthly?: number;
    credits_reset_at?: Date | string;
    onboarding_complete?: boolean;
    onboarding_step?: number;
    vault_path?: string | null;
    timezone?: string;
    brief_time?: string;
    priority_platform?: string | null;
    reset_token?: string | null;
    reset_token_expiry?: Date | string | null;
    referral_code?: string | null;
    referred_by?: string | null;
    competitors?: Prisma.CompetitorUncheckedCreateNestedManyWithoutUserInput;
    platforms?: Prisma.UserPlatformUncheckedCreateNestedManyWithoutUserInput;
    chat_messages?: Prisma.ChatMessageUncheckedCreateNestedManyWithoutUserInput;
    generated_content?: Prisma.GeneratedContentUncheckedCreateNestedManyWithoutUserInput;
    experiments?: Prisma.ExperimentLogUncheckedCreateNestedManyWithoutUserInput;
    rewards?: Prisma.RewardUncheckedCreateNestedManyWithoutUserInput;
    referrals_made?: Prisma.ReferralUncheckedCreateNestedManyWithoutReferrerInput;
};
export type UserUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    stripe_customer_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    plan?: Prisma.StringFieldUpdateOperationsInput | string;
    credits_remaining?: Prisma.IntFieldUpdateOperationsInput | number;
    credits_monthly?: Prisma.IntFieldUpdateOperationsInput | number;
    credits_reset_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    onboarding_complete?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    onboarding_step?: Prisma.IntFieldUpdateOperationsInput | number;
    vault_path?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    timezone?: Prisma.StringFieldUpdateOperationsInput | string;
    brief_time?: Prisma.StringFieldUpdateOperationsInput | string;
    priority_platform?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reset_token?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reset_token_expiry?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    referral_code?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    referred_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    competitors?: Prisma.CompetitorUpdateManyWithoutUserNestedInput;
    platforms?: Prisma.UserPlatformUpdateManyWithoutUserNestedInput;
    chat_messages?: Prisma.ChatMessageUpdateManyWithoutUserNestedInput;
    generated_content?: Prisma.GeneratedContentUpdateManyWithoutUserNestedInput;
    experiments?: Prisma.ExperimentLogUpdateManyWithoutUserNestedInput;
    rewards?: Prisma.RewardUpdateManyWithoutUserNestedInput;
    referrals_made?: Prisma.ReferralUpdateManyWithoutReferrerNestedInput;
};
export type UserUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    stripe_customer_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    plan?: Prisma.StringFieldUpdateOperationsInput | string;
    credits_remaining?: Prisma.IntFieldUpdateOperationsInput | number;
    credits_monthly?: Prisma.IntFieldUpdateOperationsInput | number;
    credits_reset_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    onboarding_complete?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    onboarding_step?: Prisma.IntFieldUpdateOperationsInput | number;
    vault_path?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    timezone?: Prisma.StringFieldUpdateOperationsInput | string;
    brief_time?: Prisma.StringFieldUpdateOperationsInput | string;
    priority_platform?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reset_token?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reset_token_expiry?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    referral_code?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    referred_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    competitors?: Prisma.CompetitorUncheckedUpdateManyWithoutUserNestedInput;
    platforms?: Prisma.UserPlatformUncheckedUpdateManyWithoutUserNestedInput;
    chat_messages?: Prisma.ChatMessageUncheckedUpdateManyWithoutUserNestedInput;
    generated_content?: Prisma.GeneratedContentUncheckedUpdateManyWithoutUserNestedInput;
    experiments?: Prisma.ExperimentLogUncheckedUpdateManyWithoutUserNestedInput;
    rewards?: Prisma.RewardUncheckedUpdateManyWithoutUserNestedInput;
    referrals_made?: Prisma.ReferralUncheckedUpdateManyWithoutReferrerNestedInput;
};
export type UserCreateManyInput = {
    id?: string;
    email: string;
    password_hash: string;
    name?: string | null;
    created_at?: Date | string;
    updated_at?: Date | string;
    stripe_customer_id?: string | null;
    plan?: string;
    credits_remaining?: number;
    credits_monthly?: number;
    credits_reset_at?: Date | string;
    onboarding_complete?: boolean;
    onboarding_step?: number;
    vault_path?: string | null;
    timezone?: string;
    brief_time?: string;
    priority_platform?: string | null;
    reset_token?: string | null;
    reset_token_expiry?: Date | string | null;
    referral_code?: string | null;
    referred_by?: string | null;
};
export type UserUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    stripe_customer_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    plan?: Prisma.StringFieldUpdateOperationsInput | string;
    credits_remaining?: Prisma.IntFieldUpdateOperationsInput | number;
    credits_monthly?: Prisma.IntFieldUpdateOperationsInput | number;
    credits_reset_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    onboarding_complete?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    onboarding_step?: Prisma.IntFieldUpdateOperationsInput | number;
    vault_path?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    timezone?: Prisma.StringFieldUpdateOperationsInput | string;
    brief_time?: Prisma.StringFieldUpdateOperationsInput | string;
    priority_platform?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reset_token?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reset_token_expiry?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    referral_code?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    referred_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type UserUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    stripe_customer_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    plan?: Prisma.StringFieldUpdateOperationsInput | string;
    credits_remaining?: Prisma.IntFieldUpdateOperationsInput | number;
    credits_monthly?: Prisma.IntFieldUpdateOperationsInput | number;
    credits_reset_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    onboarding_complete?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    onboarding_step?: Prisma.IntFieldUpdateOperationsInput | number;
    vault_path?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    timezone?: Prisma.StringFieldUpdateOperationsInput | string;
    brief_time?: Prisma.StringFieldUpdateOperationsInput | string;
    priority_platform?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reset_token?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reset_token_expiry?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    referral_code?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    referred_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type UserCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    password_hash?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    stripe_customer_id?: Prisma.SortOrder;
    plan?: Prisma.SortOrder;
    credits_remaining?: Prisma.SortOrder;
    credits_monthly?: Prisma.SortOrder;
    credits_reset_at?: Prisma.SortOrder;
    onboarding_complete?: Prisma.SortOrder;
    onboarding_step?: Prisma.SortOrder;
    vault_path?: Prisma.SortOrder;
    timezone?: Prisma.SortOrder;
    brief_time?: Prisma.SortOrder;
    priority_platform?: Prisma.SortOrder;
    reset_token?: Prisma.SortOrder;
    reset_token_expiry?: Prisma.SortOrder;
    referral_code?: Prisma.SortOrder;
    referred_by?: Prisma.SortOrder;
};
export type UserAvgOrderByAggregateInput = {
    credits_remaining?: Prisma.SortOrder;
    credits_monthly?: Prisma.SortOrder;
    onboarding_step?: Prisma.SortOrder;
};
export type UserMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    password_hash?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    stripe_customer_id?: Prisma.SortOrder;
    plan?: Prisma.SortOrder;
    credits_remaining?: Prisma.SortOrder;
    credits_monthly?: Prisma.SortOrder;
    credits_reset_at?: Prisma.SortOrder;
    onboarding_complete?: Prisma.SortOrder;
    onboarding_step?: Prisma.SortOrder;
    vault_path?: Prisma.SortOrder;
    timezone?: Prisma.SortOrder;
    brief_time?: Prisma.SortOrder;
    priority_platform?: Prisma.SortOrder;
    reset_token?: Prisma.SortOrder;
    reset_token_expiry?: Prisma.SortOrder;
    referral_code?: Prisma.SortOrder;
    referred_by?: Prisma.SortOrder;
};
export type UserMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    password_hash?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    stripe_customer_id?: Prisma.SortOrder;
    plan?: Prisma.SortOrder;
    credits_remaining?: Prisma.SortOrder;
    credits_monthly?: Prisma.SortOrder;
    credits_reset_at?: Prisma.SortOrder;
    onboarding_complete?: Prisma.SortOrder;
    onboarding_step?: Prisma.SortOrder;
    vault_path?: Prisma.SortOrder;
    timezone?: Prisma.SortOrder;
    brief_time?: Prisma.SortOrder;
    priority_platform?: Prisma.SortOrder;
    reset_token?: Prisma.SortOrder;
    reset_token_expiry?: Prisma.SortOrder;
    referral_code?: Prisma.SortOrder;
    referred_by?: Prisma.SortOrder;
};
export type UserSumOrderByAggregateInput = {
    credits_remaining?: Prisma.SortOrder;
    credits_monthly?: Prisma.SortOrder;
    onboarding_step?: Prisma.SortOrder;
};
export type UserScalarRelationFilter = {
    is?: Prisma.UserWhereInput;
    isNot?: Prisma.UserWhereInput;
};
export type StringFieldUpdateOperationsInput = {
    set?: string;
};
export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null;
};
export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string;
};
export type IntFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type BoolFieldUpdateOperationsInput = {
    set?: boolean;
};
export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null;
};
export type UserCreateNestedOneWithoutCompetitorsInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutCompetitorsInput, Prisma.UserUncheckedCreateWithoutCompetitorsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutCompetitorsInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutCompetitorsNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutCompetitorsInput, Prisma.UserUncheckedCreateWithoutCompetitorsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutCompetitorsInput;
    upsert?: Prisma.UserUpsertWithoutCompetitorsInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutCompetitorsInput, Prisma.UserUpdateWithoutCompetitorsInput>, Prisma.UserUncheckedUpdateWithoutCompetitorsInput>;
};
export type UserCreateNestedOneWithoutPlatformsInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutPlatformsInput, Prisma.UserUncheckedCreateWithoutPlatformsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutPlatformsInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutPlatformsNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutPlatformsInput, Prisma.UserUncheckedCreateWithoutPlatformsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutPlatformsInput;
    upsert?: Prisma.UserUpsertWithoutPlatformsInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutPlatformsInput, Prisma.UserUpdateWithoutPlatformsInput>, Prisma.UserUncheckedUpdateWithoutPlatformsInput>;
};
export type UserCreateNestedOneWithoutChat_messagesInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutChat_messagesInput, Prisma.UserUncheckedCreateWithoutChat_messagesInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutChat_messagesInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutChat_messagesNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutChat_messagesInput, Prisma.UserUncheckedCreateWithoutChat_messagesInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutChat_messagesInput;
    upsert?: Prisma.UserUpsertWithoutChat_messagesInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutChat_messagesInput, Prisma.UserUpdateWithoutChat_messagesInput>, Prisma.UserUncheckedUpdateWithoutChat_messagesInput>;
};
export type UserCreateNestedOneWithoutGenerated_contentInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutGenerated_contentInput, Prisma.UserUncheckedCreateWithoutGenerated_contentInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutGenerated_contentInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutGenerated_contentNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutGenerated_contentInput, Prisma.UserUncheckedCreateWithoutGenerated_contentInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutGenerated_contentInput;
    upsert?: Prisma.UserUpsertWithoutGenerated_contentInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutGenerated_contentInput, Prisma.UserUpdateWithoutGenerated_contentInput>, Prisma.UserUncheckedUpdateWithoutGenerated_contentInput>;
};
export type UserCreateNestedOneWithoutRewardsInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutRewardsInput, Prisma.UserUncheckedCreateWithoutRewardsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutRewardsInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutRewardsNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutRewardsInput, Prisma.UserUncheckedCreateWithoutRewardsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutRewardsInput;
    upsert?: Prisma.UserUpsertWithoutRewardsInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutRewardsInput, Prisma.UserUpdateWithoutRewardsInput>, Prisma.UserUncheckedUpdateWithoutRewardsInput>;
};
export type UserCreateNestedOneWithoutReferrals_madeInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutReferrals_madeInput, Prisma.UserUncheckedCreateWithoutReferrals_madeInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutReferrals_madeInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutReferrals_madeNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutReferrals_madeInput, Prisma.UserUncheckedCreateWithoutReferrals_madeInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutReferrals_madeInput;
    upsert?: Prisma.UserUpsertWithoutReferrals_madeInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutReferrals_madeInput, Prisma.UserUpdateWithoutReferrals_madeInput>, Prisma.UserUncheckedUpdateWithoutReferrals_madeInput>;
};
export type UserCreateNestedOneWithoutExperimentsInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutExperimentsInput, Prisma.UserUncheckedCreateWithoutExperimentsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutExperimentsInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutExperimentsNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutExperimentsInput, Prisma.UserUncheckedCreateWithoutExperimentsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutExperimentsInput;
    upsert?: Prisma.UserUpsertWithoutExperimentsInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutExperimentsInput, Prisma.UserUpdateWithoutExperimentsInput>, Prisma.UserUncheckedUpdateWithoutExperimentsInput>;
};
export type UserCreateWithoutCompetitorsInput = {
    id?: string;
    email: string;
    password_hash: string;
    name?: string | null;
    created_at?: Date | string;
    updated_at?: Date | string;
    stripe_customer_id?: string | null;
    plan?: string;
    credits_remaining?: number;
    credits_monthly?: number;
    credits_reset_at?: Date | string;
    onboarding_complete?: boolean;
    onboarding_step?: number;
    vault_path?: string | null;
    timezone?: string;
    brief_time?: string;
    priority_platform?: string | null;
    reset_token?: string | null;
    reset_token_expiry?: Date | string | null;
    referral_code?: string | null;
    referred_by?: string | null;
    platforms?: Prisma.UserPlatformCreateNestedManyWithoutUserInput;
    chat_messages?: Prisma.ChatMessageCreateNestedManyWithoutUserInput;
    generated_content?: Prisma.GeneratedContentCreateNestedManyWithoutUserInput;
    experiments?: Prisma.ExperimentLogCreateNestedManyWithoutUserInput;
    rewards?: Prisma.RewardCreateNestedManyWithoutUserInput;
    referrals_made?: Prisma.ReferralCreateNestedManyWithoutReferrerInput;
};
export type UserUncheckedCreateWithoutCompetitorsInput = {
    id?: string;
    email: string;
    password_hash: string;
    name?: string | null;
    created_at?: Date | string;
    updated_at?: Date | string;
    stripe_customer_id?: string | null;
    plan?: string;
    credits_remaining?: number;
    credits_monthly?: number;
    credits_reset_at?: Date | string;
    onboarding_complete?: boolean;
    onboarding_step?: number;
    vault_path?: string | null;
    timezone?: string;
    brief_time?: string;
    priority_platform?: string | null;
    reset_token?: string | null;
    reset_token_expiry?: Date | string | null;
    referral_code?: string | null;
    referred_by?: string | null;
    platforms?: Prisma.UserPlatformUncheckedCreateNestedManyWithoutUserInput;
    chat_messages?: Prisma.ChatMessageUncheckedCreateNestedManyWithoutUserInput;
    generated_content?: Prisma.GeneratedContentUncheckedCreateNestedManyWithoutUserInput;
    experiments?: Prisma.ExperimentLogUncheckedCreateNestedManyWithoutUserInput;
    rewards?: Prisma.RewardUncheckedCreateNestedManyWithoutUserInput;
    referrals_made?: Prisma.ReferralUncheckedCreateNestedManyWithoutReferrerInput;
};
export type UserCreateOrConnectWithoutCompetitorsInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutCompetitorsInput, Prisma.UserUncheckedCreateWithoutCompetitorsInput>;
};
export type UserUpsertWithoutCompetitorsInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutCompetitorsInput, Prisma.UserUncheckedUpdateWithoutCompetitorsInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutCompetitorsInput, Prisma.UserUncheckedCreateWithoutCompetitorsInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutCompetitorsInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutCompetitorsInput, Prisma.UserUncheckedUpdateWithoutCompetitorsInput>;
};
export type UserUpdateWithoutCompetitorsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    stripe_customer_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    plan?: Prisma.StringFieldUpdateOperationsInput | string;
    credits_remaining?: Prisma.IntFieldUpdateOperationsInput | number;
    credits_monthly?: Prisma.IntFieldUpdateOperationsInput | number;
    credits_reset_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    onboarding_complete?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    onboarding_step?: Prisma.IntFieldUpdateOperationsInput | number;
    vault_path?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    timezone?: Prisma.StringFieldUpdateOperationsInput | string;
    brief_time?: Prisma.StringFieldUpdateOperationsInput | string;
    priority_platform?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reset_token?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reset_token_expiry?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    referral_code?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    referred_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    platforms?: Prisma.UserPlatformUpdateManyWithoutUserNestedInput;
    chat_messages?: Prisma.ChatMessageUpdateManyWithoutUserNestedInput;
    generated_content?: Prisma.GeneratedContentUpdateManyWithoutUserNestedInput;
    experiments?: Prisma.ExperimentLogUpdateManyWithoutUserNestedInput;
    rewards?: Prisma.RewardUpdateManyWithoutUserNestedInput;
    referrals_made?: Prisma.ReferralUpdateManyWithoutReferrerNestedInput;
};
export type UserUncheckedUpdateWithoutCompetitorsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    stripe_customer_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    plan?: Prisma.StringFieldUpdateOperationsInput | string;
    credits_remaining?: Prisma.IntFieldUpdateOperationsInput | number;
    credits_monthly?: Prisma.IntFieldUpdateOperationsInput | number;
    credits_reset_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    onboarding_complete?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    onboarding_step?: Prisma.IntFieldUpdateOperationsInput | number;
    vault_path?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    timezone?: Prisma.StringFieldUpdateOperationsInput | string;
    brief_time?: Prisma.StringFieldUpdateOperationsInput | string;
    priority_platform?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reset_token?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reset_token_expiry?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    referral_code?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    referred_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    platforms?: Prisma.UserPlatformUncheckedUpdateManyWithoutUserNestedInput;
    chat_messages?: Prisma.ChatMessageUncheckedUpdateManyWithoutUserNestedInput;
    generated_content?: Prisma.GeneratedContentUncheckedUpdateManyWithoutUserNestedInput;
    experiments?: Prisma.ExperimentLogUncheckedUpdateManyWithoutUserNestedInput;
    rewards?: Prisma.RewardUncheckedUpdateManyWithoutUserNestedInput;
    referrals_made?: Prisma.ReferralUncheckedUpdateManyWithoutReferrerNestedInput;
};
export type UserCreateWithoutPlatformsInput = {
    id?: string;
    email: string;
    password_hash: string;
    name?: string | null;
    created_at?: Date | string;
    updated_at?: Date | string;
    stripe_customer_id?: string | null;
    plan?: string;
    credits_remaining?: number;
    credits_monthly?: number;
    credits_reset_at?: Date | string;
    onboarding_complete?: boolean;
    onboarding_step?: number;
    vault_path?: string | null;
    timezone?: string;
    brief_time?: string;
    priority_platform?: string | null;
    reset_token?: string | null;
    reset_token_expiry?: Date | string | null;
    referral_code?: string | null;
    referred_by?: string | null;
    competitors?: Prisma.CompetitorCreateNestedManyWithoutUserInput;
    chat_messages?: Prisma.ChatMessageCreateNestedManyWithoutUserInput;
    generated_content?: Prisma.GeneratedContentCreateNestedManyWithoutUserInput;
    experiments?: Prisma.ExperimentLogCreateNestedManyWithoutUserInput;
    rewards?: Prisma.RewardCreateNestedManyWithoutUserInput;
    referrals_made?: Prisma.ReferralCreateNestedManyWithoutReferrerInput;
};
export type UserUncheckedCreateWithoutPlatformsInput = {
    id?: string;
    email: string;
    password_hash: string;
    name?: string | null;
    created_at?: Date | string;
    updated_at?: Date | string;
    stripe_customer_id?: string | null;
    plan?: string;
    credits_remaining?: number;
    credits_monthly?: number;
    credits_reset_at?: Date | string;
    onboarding_complete?: boolean;
    onboarding_step?: number;
    vault_path?: string | null;
    timezone?: string;
    brief_time?: string;
    priority_platform?: string | null;
    reset_token?: string | null;
    reset_token_expiry?: Date | string | null;
    referral_code?: string | null;
    referred_by?: string | null;
    competitors?: Prisma.CompetitorUncheckedCreateNestedManyWithoutUserInput;
    chat_messages?: Prisma.ChatMessageUncheckedCreateNestedManyWithoutUserInput;
    generated_content?: Prisma.GeneratedContentUncheckedCreateNestedManyWithoutUserInput;
    experiments?: Prisma.ExperimentLogUncheckedCreateNestedManyWithoutUserInput;
    rewards?: Prisma.RewardUncheckedCreateNestedManyWithoutUserInput;
    referrals_made?: Prisma.ReferralUncheckedCreateNestedManyWithoutReferrerInput;
};
export type UserCreateOrConnectWithoutPlatformsInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutPlatformsInput, Prisma.UserUncheckedCreateWithoutPlatformsInput>;
};
export type UserUpsertWithoutPlatformsInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutPlatformsInput, Prisma.UserUncheckedUpdateWithoutPlatformsInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutPlatformsInput, Prisma.UserUncheckedCreateWithoutPlatformsInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutPlatformsInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutPlatformsInput, Prisma.UserUncheckedUpdateWithoutPlatformsInput>;
};
export type UserUpdateWithoutPlatformsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    stripe_customer_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    plan?: Prisma.StringFieldUpdateOperationsInput | string;
    credits_remaining?: Prisma.IntFieldUpdateOperationsInput | number;
    credits_monthly?: Prisma.IntFieldUpdateOperationsInput | number;
    credits_reset_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    onboarding_complete?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    onboarding_step?: Prisma.IntFieldUpdateOperationsInput | number;
    vault_path?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    timezone?: Prisma.StringFieldUpdateOperationsInput | string;
    brief_time?: Prisma.StringFieldUpdateOperationsInput | string;
    priority_platform?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reset_token?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reset_token_expiry?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    referral_code?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    referred_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    competitors?: Prisma.CompetitorUpdateManyWithoutUserNestedInput;
    chat_messages?: Prisma.ChatMessageUpdateManyWithoutUserNestedInput;
    generated_content?: Prisma.GeneratedContentUpdateManyWithoutUserNestedInput;
    experiments?: Prisma.ExperimentLogUpdateManyWithoutUserNestedInput;
    rewards?: Prisma.RewardUpdateManyWithoutUserNestedInput;
    referrals_made?: Prisma.ReferralUpdateManyWithoutReferrerNestedInput;
};
export type UserUncheckedUpdateWithoutPlatformsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    stripe_customer_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    plan?: Prisma.StringFieldUpdateOperationsInput | string;
    credits_remaining?: Prisma.IntFieldUpdateOperationsInput | number;
    credits_monthly?: Prisma.IntFieldUpdateOperationsInput | number;
    credits_reset_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    onboarding_complete?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    onboarding_step?: Prisma.IntFieldUpdateOperationsInput | number;
    vault_path?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    timezone?: Prisma.StringFieldUpdateOperationsInput | string;
    brief_time?: Prisma.StringFieldUpdateOperationsInput | string;
    priority_platform?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reset_token?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reset_token_expiry?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    referral_code?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    referred_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    competitors?: Prisma.CompetitorUncheckedUpdateManyWithoutUserNestedInput;
    chat_messages?: Prisma.ChatMessageUncheckedUpdateManyWithoutUserNestedInput;
    generated_content?: Prisma.GeneratedContentUncheckedUpdateManyWithoutUserNestedInput;
    experiments?: Prisma.ExperimentLogUncheckedUpdateManyWithoutUserNestedInput;
    rewards?: Prisma.RewardUncheckedUpdateManyWithoutUserNestedInput;
    referrals_made?: Prisma.ReferralUncheckedUpdateManyWithoutReferrerNestedInput;
};
export type UserCreateWithoutChat_messagesInput = {
    id?: string;
    email: string;
    password_hash: string;
    name?: string | null;
    created_at?: Date | string;
    updated_at?: Date | string;
    stripe_customer_id?: string | null;
    plan?: string;
    credits_remaining?: number;
    credits_monthly?: number;
    credits_reset_at?: Date | string;
    onboarding_complete?: boolean;
    onboarding_step?: number;
    vault_path?: string | null;
    timezone?: string;
    brief_time?: string;
    priority_platform?: string | null;
    reset_token?: string | null;
    reset_token_expiry?: Date | string | null;
    referral_code?: string | null;
    referred_by?: string | null;
    competitors?: Prisma.CompetitorCreateNestedManyWithoutUserInput;
    platforms?: Prisma.UserPlatformCreateNestedManyWithoutUserInput;
    generated_content?: Prisma.GeneratedContentCreateNestedManyWithoutUserInput;
    experiments?: Prisma.ExperimentLogCreateNestedManyWithoutUserInput;
    rewards?: Prisma.RewardCreateNestedManyWithoutUserInput;
    referrals_made?: Prisma.ReferralCreateNestedManyWithoutReferrerInput;
};
export type UserUncheckedCreateWithoutChat_messagesInput = {
    id?: string;
    email: string;
    password_hash: string;
    name?: string | null;
    created_at?: Date | string;
    updated_at?: Date | string;
    stripe_customer_id?: string | null;
    plan?: string;
    credits_remaining?: number;
    credits_monthly?: number;
    credits_reset_at?: Date | string;
    onboarding_complete?: boolean;
    onboarding_step?: number;
    vault_path?: string | null;
    timezone?: string;
    brief_time?: string;
    priority_platform?: string | null;
    reset_token?: string | null;
    reset_token_expiry?: Date | string | null;
    referral_code?: string | null;
    referred_by?: string | null;
    competitors?: Prisma.CompetitorUncheckedCreateNestedManyWithoutUserInput;
    platforms?: Prisma.UserPlatformUncheckedCreateNestedManyWithoutUserInput;
    generated_content?: Prisma.GeneratedContentUncheckedCreateNestedManyWithoutUserInput;
    experiments?: Prisma.ExperimentLogUncheckedCreateNestedManyWithoutUserInput;
    rewards?: Prisma.RewardUncheckedCreateNestedManyWithoutUserInput;
    referrals_made?: Prisma.ReferralUncheckedCreateNestedManyWithoutReferrerInput;
};
export type UserCreateOrConnectWithoutChat_messagesInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutChat_messagesInput, Prisma.UserUncheckedCreateWithoutChat_messagesInput>;
};
export type UserUpsertWithoutChat_messagesInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutChat_messagesInput, Prisma.UserUncheckedUpdateWithoutChat_messagesInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutChat_messagesInput, Prisma.UserUncheckedCreateWithoutChat_messagesInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutChat_messagesInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutChat_messagesInput, Prisma.UserUncheckedUpdateWithoutChat_messagesInput>;
};
export type UserUpdateWithoutChat_messagesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    stripe_customer_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    plan?: Prisma.StringFieldUpdateOperationsInput | string;
    credits_remaining?: Prisma.IntFieldUpdateOperationsInput | number;
    credits_monthly?: Prisma.IntFieldUpdateOperationsInput | number;
    credits_reset_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    onboarding_complete?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    onboarding_step?: Prisma.IntFieldUpdateOperationsInput | number;
    vault_path?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    timezone?: Prisma.StringFieldUpdateOperationsInput | string;
    brief_time?: Prisma.StringFieldUpdateOperationsInput | string;
    priority_platform?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reset_token?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reset_token_expiry?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    referral_code?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    referred_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    competitors?: Prisma.CompetitorUpdateManyWithoutUserNestedInput;
    platforms?: Prisma.UserPlatformUpdateManyWithoutUserNestedInput;
    generated_content?: Prisma.GeneratedContentUpdateManyWithoutUserNestedInput;
    experiments?: Prisma.ExperimentLogUpdateManyWithoutUserNestedInput;
    rewards?: Prisma.RewardUpdateManyWithoutUserNestedInput;
    referrals_made?: Prisma.ReferralUpdateManyWithoutReferrerNestedInput;
};
export type UserUncheckedUpdateWithoutChat_messagesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    stripe_customer_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    plan?: Prisma.StringFieldUpdateOperationsInput | string;
    credits_remaining?: Prisma.IntFieldUpdateOperationsInput | number;
    credits_monthly?: Prisma.IntFieldUpdateOperationsInput | number;
    credits_reset_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    onboarding_complete?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    onboarding_step?: Prisma.IntFieldUpdateOperationsInput | number;
    vault_path?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    timezone?: Prisma.StringFieldUpdateOperationsInput | string;
    brief_time?: Prisma.StringFieldUpdateOperationsInput | string;
    priority_platform?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reset_token?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reset_token_expiry?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    referral_code?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    referred_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    competitors?: Prisma.CompetitorUncheckedUpdateManyWithoutUserNestedInput;
    platforms?: Prisma.UserPlatformUncheckedUpdateManyWithoutUserNestedInput;
    generated_content?: Prisma.GeneratedContentUncheckedUpdateManyWithoutUserNestedInput;
    experiments?: Prisma.ExperimentLogUncheckedUpdateManyWithoutUserNestedInput;
    rewards?: Prisma.RewardUncheckedUpdateManyWithoutUserNestedInput;
    referrals_made?: Prisma.ReferralUncheckedUpdateManyWithoutReferrerNestedInput;
};
export type UserCreateWithoutGenerated_contentInput = {
    id?: string;
    email: string;
    password_hash: string;
    name?: string | null;
    created_at?: Date | string;
    updated_at?: Date | string;
    stripe_customer_id?: string | null;
    plan?: string;
    credits_remaining?: number;
    credits_monthly?: number;
    credits_reset_at?: Date | string;
    onboarding_complete?: boolean;
    onboarding_step?: number;
    vault_path?: string | null;
    timezone?: string;
    brief_time?: string;
    priority_platform?: string | null;
    reset_token?: string | null;
    reset_token_expiry?: Date | string | null;
    referral_code?: string | null;
    referred_by?: string | null;
    competitors?: Prisma.CompetitorCreateNestedManyWithoutUserInput;
    platforms?: Prisma.UserPlatformCreateNestedManyWithoutUserInput;
    chat_messages?: Prisma.ChatMessageCreateNestedManyWithoutUserInput;
    experiments?: Prisma.ExperimentLogCreateNestedManyWithoutUserInput;
    rewards?: Prisma.RewardCreateNestedManyWithoutUserInput;
    referrals_made?: Prisma.ReferralCreateNestedManyWithoutReferrerInput;
};
export type UserUncheckedCreateWithoutGenerated_contentInput = {
    id?: string;
    email: string;
    password_hash: string;
    name?: string | null;
    created_at?: Date | string;
    updated_at?: Date | string;
    stripe_customer_id?: string | null;
    plan?: string;
    credits_remaining?: number;
    credits_monthly?: number;
    credits_reset_at?: Date | string;
    onboarding_complete?: boolean;
    onboarding_step?: number;
    vault_path?: string | null;
    timezone?: string;
    brief_time?: string;
    priority_platform?: string | null;
    reset_token?: string | null;
    reset_token_expiry?: Date | string | null;
    referral_code?: string | null;
    referred_by?: string | null;
    competitors?: Prisma.CompetitorUncheckedCreateNestedManyWithoutUserInput;
    platforms?: Prisma.UserPlatformUncheckedCreateNestedManyWithoutUserInput;
    chat_messages?: Prisma.ChatMessageUncheckedCreateNestedManyWithoutUserInput;
    experiments?: Prisma.ExperimentLogUncheckedCreateNestedManyWithoutUserInput;
    rewards?: Prisma.RewardUncheckedCreateNestedManyWithoutUserInput;
    referrals_made?: Prisma.ReferralUncheckedCreateNestedManyWithoutReferrerInput;
};
export type UserCreateOrConnectWithoutGenerated_contentInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutGenerated_contentInput, Prisma.UserUncheckedCreateWithoutGenerated_contentInput>;
};
export type UserUpsertWithoutGenerated_contentInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutGenerated_contentInput, Prisma.UserUncheckedUpdateWithoutGenerated_contentInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutGenerated_contentInput, Prisma.UserUncheckedCreateWithoutGenerated_contentInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutGenerated_contentInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutGenerated_contentInput, Prisma.UserUncheckedUpdateWithoutGenerated_contentInput>;
};
export type UserUpdateWithoutGenerated_contentInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    stripe_customer_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    plan?: Prisma.StringFieldUpdateOperationsInput | string;
    credits_remaining?: Prisma.IntFieldUpdateOperationsInput | number;
    credits_monthly?: Prisma.IntFieldUpdateOperationsInput | number;
    credits_reset_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    onboarding_complete?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    onboarding_step?: Prisma.IntFieldUpdateOperationsInput | number;
    vault_path?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    timezone?: Prisma.StringFieldUpdateOperationsInput | string;
    brief_time?: Prisma.StringFieldUpdateOperationsInput | string;
    priority_platform?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reset_token?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reset_token_expiry?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    referral_code?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    referred_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    competitors?: Prisma.CompetitorUpdateManyWithoutUserNestedInput;
    platforms?: Prisma.UserPlatformUpdateManyWithoutUserNestedInput;
    chat_messages?: Prisma.ChatMessageUpdateManyWithoutUserNestedInput;
    experiments?: Prisma.ExperimentLogUpdateManyWithoutUserNestedInput;
    rewards?: Prisma.RewardUpdateManyWithoutUserNestedInput;
    referrals_made?: Prisma.ReferralUpdateManyWithoutReferrerNestedInput;
};
export type UserUncheckedUpdateWithoutGenerated_contentInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    stripe_customer_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    plan?: Prisma.StringFieldUpdateOperationsInput | string;
    credits_remaining?: Prisma.IntFieldUpdateOperationsInput | number;
    credits_monthly?: Prisma.IntFieldUpdateOperationsInput | number;
    credits_reset_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    onboarding_complete?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    onboarding_step?: Prisma.IntFieldUpdateOperationsInput | number;
    vault_path?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    timezone?: Prisma.StringFieldUpdateOperationsInput | string;
    brief_time?: Prisma.StringFieldUpdateOperationsInput | string;
    priority_platform?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reset_token?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reset_token_expiry?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    referral_code?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    referred_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    competitors?: Prisma.CompetitorUncheckedUpdateManyWithoutUserNestedInput;
    platforms?: Prisma.UserPlatformUncheckedUpdateManyWithoutUserNestedInput;
    chat_messages?: Prisma.ChatMessageUncheckedUpdateManyWithoutUserNestedInput;
    experiments?: Prisma.ExperimentLogUncheckedUpdateManyWithoutUserNestedInput;
    rewards?: Prisma.RewardUncheckedUpdateManyWithoutUserNestedInput;
    referrals_made?: Prisma.ReferralUncheckedUpdateManyWithoutReferrerNestedInput;
};
export type UserCreateWithoutRewardsInput = {
    id?: string;
    email: string;
    password_hash: string;
    name?: string | null;
    created_at?: Date | string;
    updated_at?: Date | string;
    stripe_customer_id?: string | null;
    plan?: string;
    credits_remaining?: number;
    credits_monthly?: number;
    credits_reset_at?: Date | string;
    onboarding_complete?: boolean;
    onboarding_step?: number;
    vault_path?: string | null;
    timezone?: string;
    brief_time?: string;
    priority_platform?: string | null;
    reset_token?: string | null;
    reset_token_expiry?: Date | string | null;
    referral_code?: string | null;
    referred_by?: string | null;
    competitors?: Prisma.CompetitorCreateNestedManyWithoutUserInput;
    platforms?: Prisma.UserPlatformCreateNestedManyWithoutUserInput;
    chat_messages?: Prisma.ChatMessageCreateNestedManyWithoutUserInput;
    generated_content?: Prisma.GeneratedContentCreateNestedManyWithoutUserInput;
    experiments?: Prisma.ExperimentLogCreateNestedManyWithoutUserInput;
    referrals_made?: Prisma.ReferralCreateNestedManyWithoutReferrerInput;
};
export type UserUncheckedCreateWithoutRewardsInput = {
    id?: string;
    email: string;
    password_hash: string;
    name?: string | null;
    created_at?: Date | string;
    updated_at?: Date | string;
    stripe_customer_id?: string | null;
    plan?: string;
    credits_remaining?: number;
    credits_monthly?: number;
    credits_reset_at?: Date | string;
    onboarding_complete?: boolean;
    onboarding_step?: number;
    vault_path?: string | null;
    timezone?: string;
    brief_time?: string;
    priority_platform?: string | null;
    reset_token?: string | null;
    reset_token_expiry?: Date | string | null;
    referral_code?: string | null;
    referred_by?: string | null;
    competitors?: Prisma.CompetitorUncheckedCreateNestedManyWithoutUserInput;
    platforms?: Prisma.UserPlatformUncheckedCreateNestedManyWithoutUserInput;
    chat_messages?: Prisma.ChatMessageUncheckedCreateNestedManyWithoutUserInput;
    generated_content?: Prisma.GeneratedContentUncheckedCreateNestedManyWithoutUserInput;
    experiments?: Prisma.ExperimentLogUncheckedCreateNestedManyWithoutUserInput;
    referrals_made?: Prisma.ReferralUncheckedCreateNestedManyWithoutReferrerInput;
};
export type UserCreateOrConnectWithoutRewardsInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutRewardsInput, Prisma.UserUncheckedCreateWithoutRewardsInput>;
};
export type UserUpsertWithoutRewardsInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutRewardsInput, Prisma.UserUncheckedUpdateWithoutRewardsInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutRewardsInput, Prisma.UserUncheckedCreateWithoutRewardsInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutRewardsInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutRewardsInput, Prisma.UserUncheckedUpdateWithoutRewardsInput>;
};
export type UserUpdateWithoutRewardsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    stripe_customer_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    plan?: Prisma.StringFieldUpdateOperationsInput | string;
    credits_remaining?: Prisma.IntFieldUpdateOperationsInput | number;
    credits_monthly?: Prisma.IntFieldUpdateOperationsInput | number;
    credits_reset_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    onboarding_complete?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    onboarding_step?: Prisma.IntFieldUpdateOperationsInput | number;
    vault_path?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    timezone?: Prisma.StringFieldUpdateOperationsInput | string;
    brief_time?: Prisma.StringFieldUpdateOperationsInput | string;
    priority_platform?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reset_token?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reset_token_expiry?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    referral_code?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    referred_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    competitors?: Prisma.CompetitorUpdateManyWithoutUserNestedInput;
    platforms?: Prisma.UserPlatformUpdateManyWithoutUserNestedInput;
    chat_messages?: Prisma.ChatMessageUpdateManyWithoutUserNestedInput;
    generated_content?: Prisma.GeneratedContentUpdateManyWithoutUserNestedInput;
    experiments?: Prisma.ExperimentLogUpdateManyWithoutUserNestedInput;
    referrals_made?: Prisma.ReferralUpdateManyWithoutReferrerNestedInput;
};
export type UserUncheckedUpdateWithoutRewardsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    stripe_customer_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    plan?: Prisma.StringFieldUpdateOperationsInput | string;
    credits_remaining?: Prisma.IntFieldUpdateOperationsInput | number;
    credits_monthly?: Prisma.IntFieldUpdateOperationsInput | number;
    credits_reset_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    onboarding_complete?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    onboarding_step?: Prisma.IntFieldUpdateOperationsInput | number;
    vault_path?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    timezone?: Prisma.StringFieldUpdateOperationsInput | string;
    brief_time?: Prisma.StringFieldUpdateOperationsInput | string;
    priority_platform?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reset_token?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reset_token_expiry?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    referral_code?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    referred_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    competitors?: Prisma.CompetitorUncheckedUpdateManyWithoutUserNestedInput;
    platforms?: Prisma.UserPlatformUncheckedUpdateManyWithoutUserNestedInput;
    chat_messages?: Prisma.ChatMessageUncheckedUpdateManyWithoutUserNestedInput;
    generated_content?: Prisma.GeneratedContentUncheckedUpdateManyWithoutUserNestedInput;
    experiments?: Prisma.ExperimentLogUncheckedUpdateManyWithoutUserNestedInput;
    referrals_made?: Prisma.ReferralUncheckedUpdateManyWithoutReferrerNestedInput;
};
export type UserCreateWithoutReferrals_madeInput = {
    id?: string;
    email: string;
    password_hash: string;
    name?: string | null;
    created_at?: Date | string;
    updated_at?: Date | string;
    stripe_customer_id?: string | null;
    plan?: string;
    credits_remaining?: number;
    credits_monthly?: number;
    credits_reset_at?: Date | string;
    onboarding_complete?: boolean;
    onboarding_step?: number;
    vault_path?: string | null;
    timezone?: string;
    brief_time?: string;
    priority_platform?: string | null;
    reset_token?: string | null;
    reset_token_expiry?: Date | string | null;
    referral_code?: string | null;
    referred_by?: string | null;
    competitors?: Prisma.CompetitorCreateNestedManyWithoutUserInput;
    platforms?: Prisma.UserPlatformCreateNestedManyWithoutUserInput;
    chat_messages?: Prisma.ChatMessageCreateNestedManyWithoutUserInput;
    generated_content?: Prisma.GeneratedContentCreateNestedManyWithoutUserInput;
    experiments?: Prisma.ExperimentLogCreateNestedManyWithoutUserInput;
    rewards?: Prisma.RewardCreateNestedManyWithoutUserInput;
};
export type UserUncheckedCreateWithoutReferrals_madeInput = {
    id?: string;
    email: string;
    password_hash: string;
    name?: string | null;
    created_at?: Date | string;
    updated_at?: Date | string;
    stripe_customer_id?: string | null;
    plan?: string;
    credits_remaining?: number;
    credits_monthly?: number;
    credits_reset_at?: Date | string;
    onboarding_complete?: boolean;
    onboarding_step?: number;
    vault_path?: string | null;
    timezone?: string;
    brief_time?: string;
    priority_platform?: string | null;
    reset_token?: string | null;
    reset_token_expiry?: Date | string | null;
    referral_code?: string | null;
    referred_by?: string | null;
    competitors?: Prisma.CompetitorUncheckedCreateNestedManyWithoutUserInput;
    platforms?: Prisma.UserPlatformUncheckedCreateNestedManyWithoutUserInput;
    chat_messages?: Prisma.ChatMessageUncheckedCreateNestedManyWithoutUserInput;
    generated_content?: Prisma.GeneratedContentUncheckedCreateNestedManyWithoutUserInput;
    experiments?: Prisma.ExperimentLogUncheckedCreateNestedManyWithoutUserInput;
    rewards?: Prisma.RewardUncheckedCreateNestedManyWithoutUserInput;
};
export type UserCreateOrConnectWithoutReferrals_madeInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutReferrals_madeInput, Prisma.UserUncheckedCreateWithoutReferrals_madeInput>;
};
export type UserUpsertWithoutReferrals_madeInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutReferrals_madeInput, Prisma.UserUncheckedUpdateWithoutReferrals_madeInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutReferrals_madeInput, Prisma.UserUncheckedCreateWithoutReferrals_madeInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutReferrals_madeInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutReferrals_madeInput, Prisma.UserUncheckedUpdateWithoutReferrals_madeInput>;
};
export type UserUpdateWithoutReferrals_madeInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    stripe_customer_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    plan?: Prisma.StringFieldUpdateOperationsInput | string;
    credits_remaining?: Prisma.IntFieldUpdateOperationsInput | number;
    credits_monthly?: Prisma.IntFieldUpdateOperationsInput | number;
    credits_reset_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    onboarding_complete?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    onboarding_step?: Prisma.IntFieldUpdateOperationsInput | number;
    vault_path?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    timezone?: Prisma.StringFieldUpdateOperationsInput | string;
    brief_time?: Prisma.StringFieldUpdateOperationsInput | string;
    priority_platform?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reset_token?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reset_token_expiry?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    referral_code?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    referred_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    competitors?: Prisma.CompetitorUpdateManyWithoutUserNestedInput;
    platforms?: Prisma.UserPlatformUpdateManyWithoutUserNestedInput;
    chat_messages?: Prisma.ChatMessageUpdateManyWithoutUserNestedInput;
    generated_content?: Prisma.GeneratedContentUpdateManyWithoutUserNestedInput;
    experiments?: Prisma.ExperimentLogUpdateManyWithoutUserNestedInput;
    rewards?: Prisma.RewardUpdateManyWithoutUserNestedInput;
};
export type UserUncheckedUpdateWithoutReferrals_madeInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    stripe_customer_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    plan?: Prisma.StringFieldUpdateOperationsInput | string;
    credits_remaining?: Prisma.IntFieldUpdateOperationsInput | number;
    credits_monthly?: Prisma.IntFieldUpdateOperationsInput | number;
    credits_reset_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    onboarding_complete?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    onboarding_step?: Prisma.IntFieldUpdateOperationsInput | number;
    vault_path?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    timezone?: Prisma.StringFieldUpdateOperationsInput | string;
    brief_time?: Prisma.StringFieldUpdateOperationsInput | string;
    priority_platform?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reset_token?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reset_token_expiry?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    referral_code?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    referred_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    competitors?: Prisma.CompetitorUncheckedUpdateManyWithoutUserNestedInput;
    platforms?: Prisma.UserPlatformUncheckedUpdateManyWithoutUserNestedInput;
    chat_messages?: Prisma.ChatMessageUncheckedUpdateManyWithoutUserNestedInput;
    generated_content?: Prisma.GeneratedContentUncheckedUpdateManyWithoutUserNestedInput;
    experiments?: Prisma.ExperimentLogUncheckedUpdateManyWithoutUserNestedInput;
    rewards?: Prisma.RewardUncheckedUpdateManyWithoutUserNestedInput;
};
export type UserCreateWithoutExperimentsInput = {
    id?: string;
    email: string;
    password_hash: string;
    name?: string | null;
    created_at?: Date | string;
    updated_at?: Date | string;
    stripe_customer_id?: string | null;
    plan?: string;
    credits_remaining?: number;
    credits_monthly?: number;
    credits_reset_at?: Date | string;
    onboarding_complete?: boolean;
    onboarding_step?: number;
    vault_path?: string | null;
    timezone?: string;
    brief_time?: string;
    priority_platform?: string | null;
    reset_token?: string | null;
    reset_token_expiry?: Date | string | null;
    referral_code?: string | null;
    referred_by?: string | null;
    competitors?: Prisma.CompetitorCreateNestedManyWithoutUserInput;
    platforms?: Prisma.UserPlatformCreateNestedManyWithoutUserInput;
    chat_messages?: Prisma.ChatMessageCreateNestedManyWithoutUserInput;
    generated_content?: Prisma.GeneratedContentCreateNestedManyWithoutUserInput;
    rewards?: Prisma.RewardCreateNestedManyWithoutUserInput;
    referrals_made?: Prisma.ReferralCreateNestedManyWithoutReferrerInput;
};
export type UserUncheckedCreateWithoutExperimentsInput = {
    id?: string;
    email: string;
    password_hash: string;
    name?: string | null;
    created_at?: Date | string;
    updated_at?: Date | string;
    stripe_customer_id?: string | null;
    plan?: string;
    credits_remaining?: number;
    credits_monthly?: number;
    credits_reset_at?: Date | string;
    onboarding_complete?: boolean;
    onboarding_step?: number;
    vault_path?: string | null;
    timezone?: string;
    brief_time?: string;
    priority_platform?: string | null;
    reset_token?: string | null;
    reset_token_expiry?: Date | string | null;
    referral_code?: string | null;
    referred_by?: string | null;
    competitors?: Prisma.CompetitorUncheckedCreateNestedManyWithoutUserInput;
    platforms?: Prisma.UserPlatformUncheckedCreateNestedManyWithoutUserInput;
    chat_messages?: Prisma.ChatMessageUncheckedCreateNestedManyWithoutUserInput;
    generated_content?: Prisma.GeneratedContentUncheckedCreateNestedManyWithoutUserInput;
    rewards?: Prisma.RewardUncheckedCreateNestedManyWithoutUserInput;
    referrals_made?: Prisma.ReferralUncheckedCreateNestedManyWithoutReferrerInput;
};
export type UserCreateOrConnectWithoutExperimentsInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutExperimentsInput, Prisma.UserUncheckedCreateWithoutExperimentsInput>;
};
export type UserUpsertWithoutExperimentsInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutExperimentsInput, Prisma.UserUncheckedUpdateWithoutExperimentsInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutExperimentsInput, Prisma.UserUncheckedCreateWithoutExperimentsInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutExperimentsInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutExperimentsInput, Prisma.UserUncheckedUpdateWithoutExperimentsInput>;
};
export type UserUpdateWithoutExperimentsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    stripe_customer_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    plan?: Prisma.StringFieldUpdateOperationsInput | string;
    credits_remaining?: Prisma.IntFieldUpdateOperationsInput | number;
    credits_monthly?: Prisma.IntFieldUpdateOperationsInput | number;
    credits_reset_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    onboarding_complete?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    onboarding_step?: Prisma.IntFieldUpdateOperationsInput | number;
    vault_path?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    timezone?: Prisma.StringFieldUpdateOperationsInput | string;
    brief_time?: Prisma.StringFieldUpdateOperationsInput | string;
    priority_platform?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reset_token?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reset_token_expiry?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    referral_code?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    referred_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    competitors?: Prisma.CompetitorUpdateManyWithoutUserNestedInput;
    platforms?: Prisma.UserPlatformUpdateManyWithoutUserNestedInput;
    chat_messages?: Prisma.ChatMessageUpdateManyWithoutUserNestedInput;
    generated_content?: Prisma.GeneratedContentUpdateManyWithoutUserNestedInput;
    rewards?: Prisma.RewardUpdateManyWithoutUserNestedInput;
    referrals_made?: Prisma.ReferralUpdateManyWithoutReferrerNestedInput;
};
export type UserUncheckedUpdateWithoutExperimentsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    stripe_customer_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    plan?: Prisma.StringFieldUpdateOperationsInput | string;
    credits_remaining?: Prisma.IntFieldUpdateOperationsInput | number;
    credits_monthly?: Prisma.IntFieldUpdateOperationsInput | number;
    credits_reset_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    onboarding_complete?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    onboarding_step?: Prisma.IntFieldUpdateOperationsInput | number;
    vault_path?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    timezone?: Prisma.StringFieldUpdateOperationsInput | string;
    brief_time?: Prisma.StringFieldUpdateOperationsInput | string;
    priority_platform?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reset_token?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reset_token_expiry?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    referral_code?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    referred_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    competitors?: Prisma.CompetitorUncheckedUpdateManyWithoutUserNestedInput;
    platforms?: Prisma.UserPlatformUncheckedUpdateManyWithoutUserNestedInput;
    chat_messages?: Prisma.ChatMessageUncheckedUpdateManyWithoutUserNestedInput;
    generated_content?: Prisma.GeneratedContentUncheckedUpdateManyWithoutUserNestedInput;
    rewards?: Prisma.RewardUncheckedUpdateManyWithoutUserNestedInput;
    referrals_made?: Prisma.ReferralUncheckedUpdateManyWithoutReferrerNestedInput;
};
/**
 * Count Type UserCountOutputType
 */
export type UserCountOutputType = {
    competitors: number;
    platforms: number;
    chat_messages: number;
    generated_content: number;
    experiments: number;
    rewards: number;
    referrals_made: number;
};
export type UserCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    competitors?: boolean | UserCountOutputTypeCountCompetitorsArgs;
    platforms?: boolean | UserCountOutputTypeCountPlatformsArgs;
    chat_messages?: boolean | UserCountOutputTypeCountChat_messagesArgs;
    generated_content?: boolean | UserCountOutputTypeCountGenerated_contentArgs;
    experiments?: boolean | UserCountOutputTypeCountExperimentsArgs;
    rewards?: boolean | UserCountOutputTypeCountRewardsArgs;
    referrals_made?: boolean | UserCountOutputTypeCountReferrals_madeArgs;
};
/**
 * UserCountOutputType without action
 */
export type UserCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: Prisma.UserCountOutputTypeSelect<ExtArgs> | null;
};
/**
 * UserCountOutputType without action
 */
export type UserCountOutputTypeCountCompetitorsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CompetitorWhereInput;
};
/**
 * UserCountOutputType without action
 */
export type UserCountOutputTypeCountPlatformsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserPlatformWhereInput;
};
/**
 * UserCountOutputType without action
 */
export type UserCountOutputTypeCountChat_messagesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ChatMessageWhereInput;
};
/**
 * UserCountOutputType without action
 */
export type UserCountOutputTypeCountGenerated_contentArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.GeneratedContentWhereInput;
};
/**
 * UserCountOutputType without action
 */
export type UserCountOutputTypeCountExperimentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ExperimentLogWhereInput;
};
/**
 * UserCountOutputType without action
 */
export type UserCountOutputTypeCountRewardsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RewardWhereInput;
};
/**
 * UserCountOutputType without action
 */
export type UserCountOutputTypeCountReferrals_madeArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ReferralWhereInput;
};
export type UserSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    email?: boolean;
    password_hash?: boolean;
    name?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    stripe_customer_id?: boolean;
    plan?: boolean;
    credits_remaining?: boolean;
    credits_monthly?: boolean;
    credits_reset_at?: boolean;
    onboarding_complete?: boolean;
    onboarding_step?: boolean;
    vault_path?: boolean;
    timezone?: boolean;
    brief_time?: boolean;
    priority_platform?: boolean;
    reset_token?: boolean;
    reset_token_expiry?: boolean;
    referral_code?: boolean;
    referred_by?: boolean;
    competitors?: boolean | Prisma.User$competitorsArgs<ExtArgs>;
    platforms?: boolean | Prisma.User$platformsArgs<ExtArgs>;
    chat_messages?: boolean | Prisma.User$chat_messagesArgs<ExtArgs>;
    generated_content?: boolean | Prisma.User$generated_contentArgs<ExtArgs>;
    experiments?: boolean | Prisma.User$experimentsArgs<ExtArgs>;
    rewards?: boolean | Prisma.User$rewardsArgs<ExtArgs>;
    referrals_made?: boolean | Prisma.User$referrals_madeArgs<ExtArgs>;
    _count?: boolean | Prisma.UserCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["user"]>;
export type UserSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    email?: boolean;
    password_hash?: boolean;
    name?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    stripe_customer_id?: boolean;
    plan?: boolean;
    credits_remaining?: boolean;
    credits_monthly?: boolean;
    credits_reset_at?: boolean;
    onboarding_complete?: boolean;
    onboarding_step?: boolean;
    vault_path?: boolean;
    timezone?: boolean;
    brief_time?: boolean;
    priority_platform?: boolean;
    reset_token?: boolean;
    reset_token_expiry?: boolean;
    referral_code?: boolean;
    referred_by?: boolean;
}, ExtArgs["result"]["user"]>;
export type UserSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    email?: boolean;
    password_hash?: boolean;
    name?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    stripe_customer_id?: boolean;
    plan?: boolean;
    credits_remaining?: boolean;
    credits_monthly?: boolean;
    credits_reset_at?: boolean;
    onboarding_complete?: boolean;
    onboarding_step?: boolean;
    vault_path?: boolean;
    timezone?: boolean;
    brief_time?: boolean;
    priority_platform?: boolean;
    reset_token?: boolean;
    reset_token_expiry?: boolean;
    referral_code?: boolean;
    referred_by?: boolean;
}, ExtArgs["result"]["user"]>;
export type UserSelectScalar = {
    id?: boolean;
    email?: boolean;
    password_hash?: boolean;
    name?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    stripe_customer_id?: boolean;
    plan?: boolean;
    credits_remaining?: boolean;
    credits_monthly?: boolean;
    credits_reset_at?: boolean;
    onboarding_complete?: boolean;
    onboarding_step?: boolean;
    vault_path?: boolean;
    timezone?: boolean;
    brief_time?: boolean;
    priority_platform?: boolean;
    reset_token?: boolean;
    reset_token_expiry?: boolean;
    referral_code?: boolean;
    referred_by?: boolean;
};
export type UserOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "email" | "password_hash" | "name" | "created_at" | "updated_at" | "stripe_customer_id" | "plan" | "credits_remaining" | "credits_monthly" | "credits_reset_at" | "onboarding_complete" | "onboarding_step" | "vault_path" | "timezone" | "brief_time" | "priority_platform" | "reset_token" | "reset_token_expiry" | "referral_code" | "referred_by", ExtArgs["result"]["user"]>;
export type UserInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    competitors?: boolean | Prisma.User$competitorsArgs<ExtArgs>;
    platforms?: boolean | Prisma.User$platformsArgs<ExtArgs>;
    chat_messages?: boolean | Prisma.User$chat_messagesArgs<ExtArgs>;
    generated_content?: boolean | Prisma.User$generated_contentArgs<ExtArgs>;
    experiments?: boolean | Prisma.User$experimentsArgs<ExtArgs>;
    rewards?: boolean | Prisma.User$rewardsArgs<ExtArgs>;
    referrals_made?: boolean | Prisma.User$referrals_madeArgs<ExtArgs>;
    _count?: boolean | Prisma.UserCountOutputTypeDefaultArgs<ExtArgs>;
};
export type UserIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type UserIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $UserPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "User";
    objects: {
        competitors: Prisma.$CompetitorPayload<ExtArgs>[];
        platforms: Prisma.$UserPlatformPayload<ExtArgs>[];
        chat_messages: Prisma.$ChatMessagePayload<ExtArgs>[];
        generated_content: Prisma.$GeneratedContentPayload<ExtArgs>[];
        experiments: Prisma.$ExperimentLogPayload<ExtArgs>[];
        rewards: Prisma.$RewardPayload<ExtArgs>[];
        referrals_made: Prisma.$ReferralPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        email: string;
        password_hash: string;
        name: string | null;
        created_at: Date;
        updated_at: Date;
        stripe_customer_id: string | null;
        plan: string;
        credits_remaining: number;
        credits_monthly: number;
        credits_reset_at: Date;
        onboarding_complete: boolean;
        onboarding_step: number;
        vault_path: string | null;
        timezone: string;
        brief_time: string;
        priority_platform: string | null;
        reset_token: string | null;
        reset_token_expiry: Date | null;
        referral_code: string | null;
        referred_by: string | null;
    }, ExtArgs["result"]["user"]>;
    composites: {};
};
export type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$UserPayload, S>;
export type UserCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: UserCountAggregateInputType | true;
};
export interface UserDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['User'];
        meta: {
            name: 'User';
        };
    };
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: Prisma.SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: Prisma.SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     *
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     *
     */
    findMany<T extends UserFindManyArgs>(args?: Prisma.SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     *
     */
    create<T extends UserCreateArgs>(args: Prisma.SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends UserCreateManyArgs>(args?: Prisma.SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     *
     */
    delete<T extends UserDeleteArgs>(args: Prisma.SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends UserUpdateArgs>(args: Prisma.SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: Prisma.SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends UserUpdateManyArgs>(args: Prisma.SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: Prisma.SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(args?: Prisma.Subset<T, UserCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], UserCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Prisma.Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>;
    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
    **/
    groupBy<T extends UserGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: UserGroupByArgs['orderBy'];
    } : {
        orderBy?: UserGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the User model
     */
    readonly fields: UserFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for User.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__UserClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    competitors<T extends Prisma.User$competitorsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$competitorsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CompetitorPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    platforms<T extends Prisma.User$platformsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$platformsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPlatformPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    chat_messages<T extends Prisma.User$chat_messagesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$chat_messagesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    generated_content<T extends Prisma.User$generated_contentArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$generated_contentArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$GeneratedContentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    experiments<T extends Prisma.User$experimentsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$experimentsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ExperimentLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    rewards<T extends Prisma.User$rewardsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$rewardsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RewardPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    referrals_made<T extends Prisma.User$referrals_madeArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$referrals_madeArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ReferralPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
/**
 * Fields of the User model
 */
export interface UserFieldRefs {
    readonly id: Prisma.FieldRef<"User", 'String'>;
    readonly email: Prisma.FieldRef<"User", 'String'>;
    readonly password_hash: Prisma.FieldRef<"User", 'String'>;
    readonly name: Prisma.FieldRef<"User", 'String'>;
    readonly created_at: Prisma.FieldRef<"User", 'DateTime'>;
    readonly updated_at: Prisma.FieldRef<"User", 'DateTime'>;
    readonly stripe_customer_id: Prisma.FieldRef<"User", 'String'>;
    readonly plan: Prisma.FieldRef<"User", 'String'>;
    readonly credits_remaining: Prisma.FieldRef<"User", 'Int'>;
    readonly credits_monthly: Prisma.FieldRef<"User", 'Int'>;
    readonly credits_reset_at: Prisma.FieldRef<"User", 'DateTime'>;
    readonly onboarding_complete: Prisma.FieldRef<"User", 'Boolean'>;
    readonly onboarding_step: Prisma.FieldRef<"User", 'Int'>;
    readonly vault_path: Prisma.FieldRef<"User", 'String'>;
    readonly timezone: Prisma.FieldRef<"User", 'String'>;
    readonly brief_time: Prisma.FieldRef<"User", 'String'>;
    readonly priority_platform: Prisma.FieldRef<"User", 'String'>;
    readonly reset_token: Prisma.FieldRef<"User", 'String'>;
    readonly reset_token_expiry: Prisma.FieldRef<"User", 'DateTime'>;
    readonly referral_code: Prisma.FieldRef<"User", 'String'>;
    readonly referred_by: Prisma.FieldRef<"User", 'String'>;
}
/**
 * User findUnique
 */
export type UserFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: Prisma.UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: Prisma.UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserInclude<ExtArgs> | null;
    /**
     * Filter, which User to fetch.
     */
    where: Prisma.UserWhereUniqueInput;
};
/**
 * User findUniqueOrThrow
 */
export type UserFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: Prisma.UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: Prisma.UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserInclude<ExtArgs> | null;
    /**
     * Filter, which User to fetch.
     */
    where: Prisma.UserWhereUniqueInput;
};
/**
 * User findFirst
 */
export type UserFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: Prisma.UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: Prisma.UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserInclude<ExtArgs> | null;
    /**
     * Filter, which User to fetch.
     */
    where?: Prisma.UserWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Users to fetch.
     */
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Users.
     */
    cursor?: Prisma.UserWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Users from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Users.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Users.
     */
    distinct?: Prisma.UserScalarFieldEnum | Prisma.UserScalarFieldEnum[];
};
/**
 * User findFirstOrThrow
 */
export type UserFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: Prisma.UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: Prisma.UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserInclude<ExtArgs> | null;
    /**
     * Filter, which User to fetch.
     */
    where?: Prisma.UserWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Users to fetch.
     */
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Users.
     */
    cursor?: Prisma.UserWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Users from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Users.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Users.
     */
    distinct?: Prisma.UserScalarFieldEnum | Prisma.UserScalarFieldEnum[];
};
/**
 * User findMany
 */
export type UserFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: Prisma.UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: Prisma.UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserInclude<ExtArgs> | null;
    /**
     * Filter, which Users to fetch.
     */
    where?: Prisma.UserWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Users to fetch.
     */
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Users.
     */
    cursor?: Prisma.UserWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Users from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Users.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Users.
     */
    distinct?: Prisma.UserScalarFieldEnum | Prisma.UserScalarFieldEnum[];
};
/**
 * User create
 */
export type UserCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: Prisma.UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: Prisma.UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserInclude<ExtArgs> | null;
    /**
     * The data needed to create a User.
     */
    data: Prisma.XOR<Prisma.UserCreateInput, Prisma.UserUncheckedCreateInput>;
};
/**
 * User createMany
 */
export type UserCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: Prisma.UserCreateManyInput | Prisma.UserCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * User createManyAndReturn
 */
export type UserCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: Prisma.UserSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: Prisma.UserOmit<ExtArgs> | null;
    /**
     * The data used to create many Users.
     */
    data: Prisma.UserCreateManyInput | Prisma.UserCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * User update
 */
export type UserUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: Prisma.UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: Prisma.UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserInclude<ExtArgs> | null;
    /**
     * The data needed to update a User.
     */
    data: Prisma.XOR<Prisma.UserUpdateInput, Prisma.UserUncheckedUpdateInput>;
    /**
     * Choose, which User to update.
     */
    where: Prisma.UserWhereUniqueInput;
};
/**
 * User updateMany
 */
export type UserUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: Prisma.XOR<Prisma.UserUpdateManyMutationInput, Prisma.UserUncheckedUpdateManyInput>;
    /**
     * Filter which Users to update
     */
    where?: Prisma.UserWhereInput;
    /**
     * Limit how many Users to update.
     */
    limit?: number;
};
/**
 * User updateManyAndReturn
 */
export type UserUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: Prisma.UserSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: Prisma.UserOmit<ExtArgs> | null;
    /**
     * The data used to update Users.
     */
    data: Prisma.XOR<Prisma.UserUpdateManyMutationInput, Prisma.UserUncheckedUpdateManyInput>;
    /**
     * Filter which Users to update
     */
    where?: Prisma.UserWhereInput;
    /**
     * Limit how many Users to update.
     */
    limit?: number;
};
/**
 * User upsert
 */
export type UserUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: Prisma.UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: Prisma.UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserInclude<ExtArgs> | null;
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: Prisma.UserWhereUniqueInput;
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: Prisma.XOR<Prisma.UserCreateInput, Prisma.UserUncheckedCreateInput>;
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.UserUpdateInput, Prisma.UserUncheckedUpdateInput>;
};
/**
 * User delete
 */
export type UserDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: Prisma.UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: Prisma.UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserInclude<ExtArgs> | null;
    /**
     * Filter which User to delete.
     */
    where: Prisma.UserWhereUniqueInput;
};
/**
 * User deleteMany
 */
export type UserDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: Prisma.UserWhereInput;
    /**
     * Limit how many Users to delete.
     */
    limit?: number;
};
/**
 * User.competitors
 */
export type User$competitorsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Competitor
     */
    select?: Prisma.CompetitorSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Competitor
     */
    omit?: Prisma.CompetitorOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.CompetitorInclude<ExtArgs> | null;
    where?: Prisma.CompetitorWhereInput;
    orderBy?: Prisma.CompetitorOrderByWithRelationInput | Prisma.CompetitorOrderByWithRelationInput[];
    cursor?: Prisma.CompetitorWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CompetitorScalarFieldEnum | Prisma.CompetitorScalarFieldEnum[];
};
/**
 * User.platforms
 */
export type User$platformsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPlatform
     */
    select?: Prisma.UserPlatformSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the UserPlatform
     */
    omit?: Prisma.UserPlatformOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserPlatformInclude<ExtArgs> | null;
    where?: Prisma.UserPlatformWhereInput;
    orderBy?: Prisma.UserPlatformOrderByWithRelationInput | Prisma.UserPlatformOrderByWithRelationInput[];
    cursor?: Prisma.UserPlatformWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserPlatformScalarFieldEnum | Prisma.UserPlatformScalarFieldEnum[];
};
/**
 * User.chat_messages
 */
export type User$chat_messagesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: Prisma.ChatMessageSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: Prisma.ChatMessageOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ChatMessageInclude<ExtArgs> | null;
    where?: Prisma.ChatMessageWhereInput;
    orderBy?: Prisma.ChatMessageOrderByWithRelationInput | Prisma.ChatMessageOrderByWithRelationInput[];
    cursor?: Prisma.ChatMessageWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ChatMessageScalarFieldEnum | Prisma.ChatMessageScalarFieldEnum[];
};
/**
 * User.generated_content
 */
export type User$generated_contentArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GeneratedContent
     */
    select?: Prisma.GeneratedContentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the GeneratedContent
     */
    omit?: Prisma.GeneratedContentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.GeneratedContentInclude<ExtArgs> | null;
    where?: Prisma.GeneratedContentWhereInput;
    orderBy?: Prisma.GeneratedContentOrderByWithRelationInput | Prisma.GeneratedContentOrderByWithRelationInput[];
    cursor?: Prisma.GeneratedContentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.GeneratedContentScalarFieldEnum | Prisma.GeneratedContentScalarFieldEnum[];
};
/**
 * User.experiments
 */
export type User$experimentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExperimentLog
     */
    select?: Prisma.ExperimentLogSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ExperimentLog
     */
    omit?: Prisma.ExperimentLogOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ExperimentLogInclude<ExtArgs> | null;
    where?: Prisma.ExperimentLogWhereInput;
    orderBy?: Prisma.ExperimentLogOrderByWithRelationInput | Prisma.ExperimentLogOrderByWithRelationInput[];
    cursor?: Prisma.ExperimentLogWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ExperimentLogScalarFieldEnum | Prisma.ExperimentLogScalarFieldEnum[];
};
/**
 * User.rewards
 */
export type User$rewardsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reward
     */
    select?: Prisma.RewardSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Reward
     */
    omit?: Prisma.RewardOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.RewardInclude<ExtArgs> | null;
    where?: Prisma.RewardWhereInput;
    orderBy?: Prisma.RewardOrderByWithRelationInput | Prisma.RewardOrderByWithRelationInput[];
    cursor?: Prisma.RewardWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RewardScalarFieldEnum | Prisma.RewardScalarFieldEnum[];
};
/**
 * User.referrals_made
 */
export type User$referrals_madeArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Referral
     */
    select?: Prisma.ReferralSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Referral
     */
    omit?: Prisma.ReferralOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ReferralInclude<ExtArgs> | null;
    where?: Prisma.ReferralWhereInput;
    orderBy?: Prisma.ReferralOrderByWithRelationInput | Prisma.ReferralOrderByWithRelationInput[];
    cursor?: Prisma.ReferralWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ReferralScalarFieldEnum | Prisma.ReferralScalarFieldEnum[];
};
/**
 * User without action
 */
export type UserDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: Prisma.UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: Prisma.UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserInclude<ExtArgs> | null;
};
export {};
//# sourceMappingURL=User.d.ts.map