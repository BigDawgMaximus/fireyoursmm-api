import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model UserPlatform
 *
 */
export type UserPlatformModel = runtime.Types.Result.DefaultSelection<Prisma.$UserPlatformPayload>;
export type AggregateUserPlatform = {
    _count: UserPlatformCountAggregateOutputType | null;
    _min: UserPlatformMinAggregateOutputType | null;
    _max: UserPlatformMaxAggregateOutputType | null;
};
export type UserPlatformMinAggregateOutputType = {
    id: string | null;
    user_id: string | null;
    platform: string | null;
    handle: string | null;
    is_priority: boolean | null;
};
export type UserPlatformMaxAggregateOutputType = {
    id: string | null;
    user_id: string | null;
    platform: string | null;
    handle: string | null;
    is_priority: boolean | null;
};
export type UserPlatformCountAggregateOutputType = {
    id: number;
    user_id: number;
    platform: number;
    handle: number;
    is_priority: number;
    _all: number;
};
export type UserPlatformMinAggregateInputType = {
    id?: true;
    user_id?: true;
    platform?: true;
    handle?: true;
    is_priority?: true;
};
export type UserPlatformMaxAggregateInputType = {
    id?: true;
    user_id?: true;
    platform?: true;
    handle?: true;
    is_priority?: true;
};
export type UserPlatformCountAggregateInputType = {
    id?: true;
    user_id?: true;
    platform?: true;
    handle?: true;
    is_priority?: true;
    _all?: true;
};
export type UserPlatformAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which UserPlatform to aggregate.
     */
    where?: Prisma.UserPlatformWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of UserPlatforms to fetch.
     */
    orderBy?: Prisma.UserPlatformOrderByWithRelationInput | Prisma.UserPlatformOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.UserPlatformWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` UserPlatforms from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` UserPlatforms.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned UserPlatforms
    **/
    _count?: true | UserPlatformCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: UserPlatformMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: UserPlatformMaxAggregateInputType;
};
export type GetUserPlatformAggregateType<T extends UserPlatformAggregateArgs> = {
    [P in keyof T & keyof AggregateUserPlatform]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateUserPlatform[P]> : Prisma.GetScalarType<T[P], AggregateUserPlatform[P]>;
};
export type UserPlatformGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserPlatformWhereInput;
    orderBy?: Prisma.UserPlatformOrderByWithAggregationInput | Prisma.UserPlatformOrderByWithAggregationInput[];
    by: Prisma.UserPlatformScalarFieldEnum[] | Prisma.UserPlatformScalarFieldEnum;
    having?: Prisma.UserPlatformScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: UserPlatformCountAggregateInputType | true;
    _min?: UserPlatformMinAggregateInputType;
    _max?: UserPlatformMaxAggregateInputType;
};
export type UserPlatformGroupByOutputType = {
    id: string;
    user_id: string;
    platform: string;
    handle: string;
    is_priority: boolean;
    _count: UserPlatformCountAggregateOutputType | null;
    _min: UserPlatformMinAggregateOutputType | null;
    _max: UserPlatformMaxAggregateOutputType | null;
};
type GetUserPlatformGroupByPayload<T extends UserPlatformGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<UserPlatformGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof UserPlatformGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], UserPlatformGroupByOutputType[P]> : Prisma.GetScalarType<T[P], UserPlatformGroupByOutputType[P]>;
}>>;
export type UserPlatformWhereInput = {
    AND?: Prisma.UserPlatformWhereInput | Prisma.UserPlatformWhereInput[];
    OR?: Prisma.UserPlatformWhereInput[];
    NOT?: Prisma.UserPlatformWhereInput | Prisma.UserPlatformWhereInput[];
    id?: Prisma.StringFilter<"UserPlatform"> | string;
    user_id?: Prisma.StringFilter<"UserPlatform"> | string;
    platform?: Prisma.StringFilter<"UserPlatform"> | string;
    handle?: Prisma.StringFilter<"UserPlatform"> | string;
    is_priority?: Prisma.BoolFilter<"UserPlatform"> | boolean;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type UserPlatformOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    platform?: Prisma.SortOrder;
    handle?: Prisma.SortOrder;
    is_priority?: Prisma.SortOrder;
    user?: Prisma.UserOrderByWithRelationInput;
};
export type UserPlatformWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    user_id_platform?: Prisma.UserPlatformUser_idPlatformCompoundUniqueInput;
    AND?: Prisma.UserPlatformWhereInput | Prisma.UserPlatformWhereInput[];
    OR?: Prisma.UserPlatformWhereInput[];
    NOT?: Prisma.UserPlatformWhereInput | Prisma.UserPlatformWhereInput[];
    user_id?: Prisma.StringFilter<"UserPlatform"> | string;
    platform?: Prisma.StringFilter<"UserPlatform"> | string;
    handle?: Prisma.StringFilter<"UserPlatform"> | string;
    is_priority?: Prisma.BoolFilter<"UserPlatform"> | boolean;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id" | "user_id_platform">;
export type UserPlatformOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    platform?: Prisma.SortOrder;
    handle?: Prisma.SortOrder;
    is_priority?: Prisma.SortOrder;
    _count?: Prisma.UserPlatformCountOrderByAggregateInput;
    _max?: Prisma.UserPlatformMaxOrderByAggregateInput;
    _min?: Prisma.UserPlatformMinOrderByAggregateInput;
};
export type UserPlatformScalarWhereWithAggregatesInput = {
    AND?: Prisma.UserPlatformScalarWhereWithAggregatesInput | Prisma.UserPlatformScalarWhereWithAggregatesInput[];
    OR?: Prisma.UserPlatformScalarWhereWithAggregatesInput[];
    NOT?: Prisma.UserPlatformScalarWhereWithAggregatesInput | Prisma.UserPlatformScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"UserPlatform"> | string;
    user_id?: Prisma.StringWithAggregatesFilter<"UserPlatform"> | string;
    platform?: Prisma.StringWithAggregatesFilter<"UserPlatform"> | string;
    handle?: Prisma.StringWithAggregatesFilter<"UserPlatform"> | string;
    is_priority?: Prisma.BoolWithAggregatesFilter<"UserPlatform"> | boolean;
};
export type UserPlatformCreateInput = {
    id?: string;
    platform: string;
    handle: string;
    is_priority?: boolean;
    user: Prisma.UserCreateNestedOneWithoutPlatformsInput;
};
export type UserPlatformUncheckedCreateInput = {
    id?: string;
    user_id: string;
    platform: string;
    handle: string;
    is_priority?: boolean;
};
export type UserPlatformUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    platform?: Prisma.StringFieldUpdateOperationsInput | string;
    handle?: Prisma.StringFieldUpdateOperationsInput | string;
    is_priority?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    user?: Prisma.UserUpdateOneRequiredWithoutPlatformsNestedInput;
};
export type UserPlatformUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    user_id?: Prisma.StringFieldUpdateOperationsInput | string;
    platform?: Prisma.StringFieldUpdateOperationsInput | string;
    handle?: Prisma.StringFieldUpdateOperationsInput | string;
    is_priority?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type UserPlatformCreateManyInput = {
    id?: string;
    user_id: string;
    platform: string;
    handle: string;
    is_priority?: boolean;
};
export type UserPlatformUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    platform?: Prisma.StringFieldUpdateOperationsInput | string;
    handle?: Prisma.StringFieldUpdateOperationsInput | string;
    is_priority?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type UserPlatformUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    user_id?: Prisma.StringFieldUpdateOperationsInput | string;
    platform?: Prisma.StringFieldUpdateOperationsInput | string;
    handle?: Prisma.StringFieldUpdateOperationsInput | string;
    is_priority?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type UserPlatformListRelationFilter = {
    every?: Prisma.UserPlatformWhereInput;
    some?: Prisma.UserPlatformWhereInput;
    none?: Prisma.UserPlatformWhereInput;
};
export type UserPlatformOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type UserPlatformUser_idPlatformCompoundUniqueInput = {
    user_id: string;
    platform: string;
};
export type UserPlatformCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    platform?: Prisma.SortOrder;
    handle?: Prisma.SortOrder;
    is_priority?: Prisma.SortOrder;
};
export type UserPlatformMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    platform?: Prisma.SortOrder;
    handle?: Prisma.SortOrder;
    is_priority?: Prisma.SortOrder;
};
export type UserPlatformMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    platform?: Prisma.SortOrder;
    handle?: Prisma.SortOrder;
    is_priority?: Prisma.SortOrder;
};
export type UserPlatformCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.UserPlatformCreateWithoutUserInput, Prisma.UserPlatformUncheckedCreateWithoutUserInput> | Prisma.UserPlatformCreateWithoutUserInput[] | Prisma.UserPlatformUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.UserPlatformCreateOrConnectWithoutUserInput | Prisma.UserPlatformCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.UserPlatformCreateManyUserInputEnvelope;
    connect?: Prisma.UserPlatformWhereUniqueInput | Prisma.UserPlatformWhereUniqueInput[];
};
export type UserPlatformUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.UserPlatformCreateWithoutUserInput, Prisma.UserPlatformUncheckedCreateWithoutUserInput> | Prisma.UserPlatformCreateWithoutUserInput[] | Prisma.UserPlatformUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.UserPlatformCreateOrConnectWithoutUserInput | Prisma.UserPlatformCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.UserPlatformCreateManyUserInputEnvelope;
    connect?: Prisma.UserPlatformWhereUniqueInput | Prisma.UserPlatformWhereUniqueInput[];
};
export type UserPlatformUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.UserPlatformCreateWithoutUserInput, Prisma.UserPlatformUncheckedCreateWithoutUserInput> | Prisma.UserPlatformCreateWithoutUserInput[] | Prisma.UserPlatformUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.UserPlatformCreateOrConnectWithoutUserInput | Prisma.UserPlatformCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.UserPlatformUpsertWithWhereUniqueWithoutUserInput | Prisma.UserPlatformUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.UserPlatformCreateManyUserInputEnvelope;
    set?: Prisma.UserPlatformWhereUniqueInput | Prisma.UserPlatformWhereUniqueInput[];
    disconnect?: Prisma.UserPlatformWhereUniqueInput | Prisma.UserPlatformWhereUniqueInput[];
    delete?: Prisma.UserPlatformWhereUniqueInput | Prisma.UserPlatformWhereUniqueInput[];
    connect?: Prisma.UserPlatformWhereUniqueInput | Prisma.UserPlatformWhereUniqueInput[];
    update?: Prisma.UserPlatformUpdateWithWhereUniqueWithoutUserInput | Prisma.UserPlatformUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.UserPlatformUpdateManyWithWhereWithoutUserInput | Prisma.UserPlatformUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.UserPlatformScalarWhereInput | Prisma.UserPlatformScalarWhereInput[];
};
export type UserPlatformUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.UserPlatformCreateWithoutUserInput, Prisma.UserPlatformUncheckedCreateWithoutUserInput> | Prisma.UserPlatformCreateWithoutUserInput[] | Prisma.UserPlatformUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.UserPlatformCreateOrConnectWithoutUserInput | Prisma.UserPlatformCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.UserPlatformUpsertWithWhereUniqueWithoutUserInput | Prisma.UserPlatformUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.UserPlatformCreateManyUserInputEnvelope;
    set?: Prisma.UserPlatformWhereUniqueInput | Prisma.UserPlatformWhereUniqueInput[];
    disconnect?: Prisma.UserPlatformWhereUniqueInput | Prisma.UserPlatformWhereUniqueInput[];
    delete?: Prisma.UserPlatformWhereUniqueInput | Prisma.UserPlatformWhereUniqueInput[];
    connect?: Prisma.UserPlatformWhereUniqueInput | Prisma.UserPlatformWhereUniqueInput[];
    update?: Prisma.UserPlatformUpdateWithWhereUniqueWithoutUserInput | Prisma.UserPlatformUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.UserPlatformUpdateManyWithWhereWithoutUserInput | Prisma.UserPlatformUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.UserPlatformScalarWhereInput | Prisma.UserPlatformScalarWhereInput[];
};
export type UserPlatformCreateWithoutUserInput = {
    id?: string;
    platform: string;
    handle: string;
    is_priority?: boolean;
};
export type UserPlatformUncheckedCreateWithoutUserInput = {
    id?: string;
    platform: string;
    handle: string;
    is_priority?: boolean;
};
export type UserPlatformCreateOrConnectWithoutUserInput = {
    where: Prisma.UserPlatformWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserPlatformCreateWithoutUserInput, Prisma.UserPlatformUncheckedCreateWithoutUserInput>;
};
export type UserPlatformCreateManyUserInputEnvelope = {
    data: Prisma.UserPlatformCreateManyUserInput | Prisma.UserPlatformCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type UserPlatformUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.UserPlatformWhereUniqueInput;
    update: Prisma.XOR<Prisma.UserPlatformUpdateWithoutUserInput, Prisma.UserPlatformUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.UserPlatformCreateWithoutUserInput, Prisma.UserPlatformUncheckedCreateWithoutUserInput>;
};
export type UserPlatformUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.UserPlatformWhereUniqueInput;
    data: Prisma.XOR<Prisma.UserPlatformUpdateWithoutUserInput, Prisma.UserPlatformUncheckedUpdateWithoutUserInput>;
};
export type UserPlatformUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.UserPlatformScalarWhereInput;
    data: Prisma.XOR<Prisma.UserPlatformUpdateManyMutationInput, Prisma.UserPlatformUncheckedUpdateManyWithoutUserInput>;
};
export type UserPlatformScalarWhereInput = {
    AND?: Prisma.UserPlatformScalarWhereInput | Prisma.UserPlatformScalarWhereInput[];
    OR?: Prisma.UserPlatformScalarWhereInput[];
    NOT?: Prisma.UserPlatformScalarWhereInput | Prisma.UserPlatformScalarWhereInput[];
    id?: Prisma.StringFilter<"UserPlatform"> | string;
    user_id?: Prisma.StringFilter<"UserPlatform"> | string;
    platform?: Prisma.StringFilter<"UserPlatform"> | string;
    handle?: Prisma.StringFilter<"UserPlatform"> | string;
    is_priority?: Prisma.BoolFilter<"UserPlatform"> | boolean;
};
export type UserPlatformCreateManyUserInput = {
    id?: string;
    platform: string;
    handle: string;
    is_priority?: boolean;
};
export type UserPlatformUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    platform?: Prisma.StringFieldUpdateOperationsInput | string;
    handle?: Prisma.StringFieldUpdateOperationsInput | string;
    is_priority?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type UserPlatformUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    platform?: Prisma.StringFieldUpdateOperationsInput | string;
    handle?: Prisma.StringFieldUpdateOperationsInput | string;
    is_priority?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type UserPlatformUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    platform?: Prisma.StringFieldUpdateOperationsInput | string;
    handle?: Prisma.StringFieldUpdateOperationsInput | string;
    is_priority?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type UserPlatformSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    user_id?: boolean;
    platform?: boolean;
    handle?: boolean;
    is_priority?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["userPlatform"]>;
export type UserPlatformSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    user_id?: boolean;
    platform?: boolean;
    handle?: boolean;
    is_priority?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["userPlatform"]>;
export type UserPlatformSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    user_id?: boolean;
    platform?: boolean;
    handle?: boolean;
    is_priority?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["userPlatform"]>;
export type UserPlatformSelectScalar = {
    id?: boolean;
    user_id?: boolean;
    platform?: boolean;
    handle?: boolean;
    is_priority?: boolean;
};
export type UserPlatformOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "user_id" | "platform" | "handle" | "is_priority", ExtArgs["result"]["userPlatform"]>;
export type UserPlatformInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type UserPlatformIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type UserPlatformIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $UserPlatformPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "UserPlatform";
    objects: {
        user: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        user_id: string;
        platform: string;
        handle: string;
        is_priority: boolean;
    }, ExtArgs["result"]["userPlatform"]>;
    composites: {};
};
export type UserPlatformGetPayload<S extends boolean | null | undefined | UserPlatformDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$UserPlatformPayload, S>;
export type UserPlatformCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<UserPlatformFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: UserPlatformCountAggregateInputType | true;
};
export interface UserPlatformDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['UserPlatform'];
        meta: {
            name: 'UserPlatform';
        };
    };
    /**
     * Find zero or one UserPlatform that matches the filter.
     * @param {UserPlatformFindUniqueArgs} args - Arguments to find a UserPlatform
     * @example
     * // Get one UserPlatform
     * const userPlatform = await prisma.userPlatform.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserPlatformFindUniqueArgs>(args: Prisma.SelectSubset<T, UserPlatformFindUniqueArgs<ExtArgs>>): Prisma.Prisma__UserPlatformClient<runtime.Types.Result.GetResult<Prisma.$UserPlatformPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one UserPlatform that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserPlatformFindUniqueOrThrowArgs} args - Arguments to find a UserPlatform
     * @example
     * // Get one UserPlatform
     * const userPlatform = await prisma.userPlatform.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserPlatformFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, UserPlatformFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__UserPlatformClient<runtime.Types.Result.GetResult<Prisma.$UserPlatformPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first UserPlatform that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserPlatformFindFirstArgs} args - Arguments to find a UserPlatform
     * @example
     * // Get one UserPlatform
     * const userPlatform = await prisma.userPlatform.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserPlatformFindFirstArgs>(args?: Prisma.SelectSubset<T, UserPlatformFindFirstArgs<ExtArgs>>): Prisma.Prisma__UserPlatformClient<runtime.Types.Result.GetResult<Prisma.$UserPlatformPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first UserPlatform that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserPlatformFindFirstOrThrowArgs} args - Arguments to find a UserPlatform
     * @example
     * // Get one UserPlatform
     * const userPlatform = await prisma.userPlatform.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserPlatformFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, UserPlatformFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__UserPlatformClient<runtime.Types.Result.GetResult<Prisma.$UserPlatformPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more UserPlatforms that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserPlatformFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserPlatforms
     * const userPlatforms = await prisma.userPlatform.findMany()
     *
     * // Get first 10 UserPlatforms
     * const userPlatforms = await prisma.userPlatform.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const userPlatformWithIdOnly = await prisma.userPlatform.findMany({ select: { id: true } })
     *
     */
    findMany<T extends UserPlatformFindManyArgs>(args?: Prisma.SelectSubset<T, UserPlatformFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPlatformPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a UserPlatform.
     * @param {UserPlatformCreateArgs} args - Arguments to create a UserPlatform.
     * @example
     * // Create one UserPlatform
     * const UserPlatform = await prisma.userPlatform.create({
     *   data: {
     *     // ... data to create a UserPlatform
     *   }
     * })
     *
     */
    create<T extends UserPlatformCreateArgs>(args: Prisma.SelectSubset<T, UserPlatformCreateArgs<ExtArgs>>): Prisma.Prisma__UserPlatformClient<runtime.Types.Result.GetResult<Prisma.$UserPlatformPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many UserPlatforms.
     * @param {UserPlatformCreateManyArgs} args - Arguments to create many UserPlatforms.
     * @example
     * // Create many UserPlatforms
     * const userPlatform = await prisma.userPlatform.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends UserPlatformCreateManyArgs>(args?: Prisma.SelectSubset<T, UserPlatformCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many UserPlatforms and returns the data saved in the database.
     * @param {UserPlatformCreateManyAndReturnArgs} args - Arguments to create many UserPlatforms.
     * @example
     * // Create many UserPlatforms
     * const userPlatform = await prisma.userPlatform.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many UserPlatforms and only return the `id`
     * const userPlatformWithIdOnly = await prisma.userPlatform.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends UserPlatformCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, UserPlatformCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPlatformPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a UserPlatform.
     * @param {UserPlatformDeleteArgs} args - Arguments to delete one UserPlatform.
     * @example
     * // Delete one UserPlatform
     * const UserPlatform = await prisma.userPlatform.delete({
     *   where: {
     *     // ... filter to delete one UserPlatform
     *   }
     * })
     *
     */
    delete<T extends UserPlatformDeleteArgs>(args: Prisma.SelectSubset<T, UserPlatformDeleteArgs<ExtArgs>>): Prisma.Prisma__UserPlatformClient<runtime.Types.Result.GetResult<Prisma.$UserPlatformPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one UserPlatform.
     * @param {UserPlatformUpdateArgs} args - Arguments to update one UserPlatform.
     * @example
     * // Update one UserPlatform
     * const userPlatform = await prisma.userPlatform.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends UserPlatformUpdateArgs>(args: Prisma.SelectSubset<T, UserPlatformUpdateArgs<ExtArgs>>): Prisma.Prisma__UserPlatformClient<runtime.Types.Result.GetResult<Prisma.$UserPlatformPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more UserPlatforms.
     * @param {UserPlatformDeleteManyArgs} args - Arguments to filter UserPlatforms to delete.
     * @example
     * // Delete a few UserPlatforms
     * const { count } = await prisma.userPlatform.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends UserPlatformDeleteManyArgs>(args?: Prisma.SelectSubset<T, UserPlatformDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more UserPlatforms.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserPlatformUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserPlatforms
     * const userPlatform = await prisma.userPlatform.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends UserPlatformUpdateManyArgs>(args: Prisma.SelectSubset<T, UserPlatformUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more UserPlatforms and returns the data updated in the database.
     * @param {UserPlatformUpdateManyAndReturnArgs} args - Arguments to update many UserPlatforms.
     * @example
     * // Update many UserPlatforms
     * const userPlatform = await prisma.userPlatform.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more UserPlatforms and only return the `id`
     * const userPlatformWithIdOnly = await prisma.userPlatform.updateManyAndReturn({
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
    updateManyAndReturn<T extends UserPlatformUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, UserPlatformUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPlatformPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one UserPlatform.
     * @param {UserPlatformUpsertArgs} args - Arguments to update or create a UserPlatform.
     * @example
     * // Update or create a UserPlatform
     * const userPlatform = await prisma.userPlatform.upsert({
     *   create: {
     *     // ... data to create a UserPlatform
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserPlatform we want to update
     *   }
     * })
     */
    upsert<T extends UserPlatformUpsertArgs>(args: Prisma.SelectSubset<T, UserPlatformUpsertArgs<ExtArgs>>): Prisma.Prisma__UserPlatformClient<runtime.Types.Result.GetResult<Prisma.$UserPlatformPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of UserPlatforms.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserPlatformCountArgs} args - Arguments to filter UserPlatforms to count.
     * @example
     * // Count the number of UserPlatforms
     * const count = await prisma.userPlatform.count({
     *   where: {
     *     // ... the filter for the UserPlatforms we want to count
     *   }
     * })
    **/
    count<T extends UserPlatformCountArgs>(args?: Prisma.Subset<T, UserPlatformCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], UserPlatformCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a UserPlatform.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserPlatformAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends UserPlatformAggregateArgs>(args: Prisma.Subset<T, UserPlatformAggregateArgs>): Prisma.PrismaPromise<GetUserPlatformAggregateType<T>>;
    /**
     * Group by UserPlatform.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserPlatformGroupByArgs} args - Group by arguments.
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
    groupBy<T extends UserPlatformGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: UserPlatformGroupByArgs['orderBy'];
    } : {
        orderBy?: UserPlatformGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, UserPlatformGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserPlatformGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the UserPlatform model
     */
    readonly fields: UserPlatformFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for UserPlatform.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__UserPlatformClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
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
 * Fields of the UserPlatform model
 */
export interface UserPlatformFieldRefs {
    readonly id: Prisma.FieldRef<"UserPlatform", 'String'>;
    readonly user_id: Prisma.FieldRef<"UserPlatform", 'String'>;
    readonly platform: Prisma.FieldRef<"UserPlatform", 'String'>;
    readonly handle: Prisma.FieldRef<"UserPlatform", 'String'>;
    readonly is_priority: Prisma.FieldRef<"UserPlatform", 'Boolean'>;
}
/**
 * UserPlatform findUnique
 */
export type UserPlatformFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which UserPlatform to fetch.
     */
    where: Prisma.UserPlatformWhereUniqueInput;
};
/**
 * UserPlatform findUniqueOrThrow
 */
export type UserPlatformFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which UserPlatform to fetch.
     */
    where: Prisma.UserPlatformWhereUniqueInput;
};
/**
 * UserPlatform findFirst
 */
export type UserPlatformFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which UserPlatform to fetch.
     */
    where?: Prisma.UserPlatformWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of UserPlatforms to fetch.
     */
    orderBy?: Prisma.UserPlatformOrderByWithRelationInput | Prisma.UserPlatformOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for UserPlatforms.
     */
    cursor?: Prisma.UserPlatformWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` UserPlatforms from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` UserPlatforms.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of UserPlatforms.
     */
    distinct?: Prisma.UserPlatformScalarFieldEnum | Prisma.UserPlatformScalarFieldEnum[];
};
/**
 * UserPlatform findFirstOrThrow
 */
export type UserPlatformFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which UserPlatform to fetch.
     */
    where?: Prisma.UserPlatformWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of UserPlatforms to fetch.
     */
    orderBy?: Prisma.UserPlatformOrderByWithRelationInput | Prisma.UserPlatformOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for UserPlatforms.
     */
    cursor?: Prisma.UserPlatformWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` UserPlatforms from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` UserPlatforms.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of UserPlatforms.
     */
    distinct?: Prisma.UserPlatformScalarFieldEnum | Prisma.UserPlatformScalarFieldEnum[];
};
/**
 * UserPlatform findMany
 */
export type UserPlatformFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which UserPlatforms to fetch.
     */
    where?: Prisma.UserPlatformWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of UserPlatforms to fetch.
     */
    orderBy?: Prisma.UserPlatformOrderByWithRelationInput | Prisma.UserPlatformOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing UserPlatforms.
     */
    cursor?: Prisma.UserPlatformWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` UserPlatforms from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` UserPlatforms.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of UserPlatforms.
     */
    distinct?: Prisma.UserPlatformScalarFieldEnum | Prisma.UserPlatformScalarFieldEnum[];
};
/**
 * UserPlatform create
 */
export type UserPlatformCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to create a UserPlatform.
     */
    data: Prisma.XOR<Prisma.UserPlatformCreateInput, Prisma.UserPlatformUncheckedCreateInput>;
};
/**
 * UserPlatform createMany
 */
export type UserPlatformCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserPlatforms.
     */
    data: Prisma.UserPlatformCreateManyInput | Prisma.UserPlatformCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * UserPlatform createManyAndReturn
 */
export type UserPlatformCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPlatform
     */
    select?: Prisma.UserPlatformSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the UserPlatform
     */
    omit?: Prisma.UserPlatformOmit<ExtArgs> | null;
    /**
     * The data used to create many UserPlatforms.
     */
    data: Prisma.UserPlatformCreateManyInput | Prisma.UserPlatformCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserPlatformIncludeCreateManyAndReturn<ExtArgs> | null;
};
/**
 * UserPlatform update
 */
export type UserPlatformUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to update a UserPlatform.
     */
    data: Prisma.XOR<Prisma.UserPlatformUpdateInput, Prisma.UserPlatformUncheckedUpdateInput>;
    /**
     * Choose, which UserPlatform to update.
     */
    where: Prisma.UserPlatformWhereUniqueInput;
};
/**
 * UserPlatform updateMany
 */
export type UserPlatformUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update UserPlatforms.
     */
    data: Prisma.XOR<Prisma.UserPlatformUpdateManyMutationInput, Prisma.UserPlatformUncheckedUpdateManyInput>;
    /**
     * Filter which UserPlatforms to update
     */
    where?: Prisma.UserPlatformWhereInput;
    /**
     * Limit how many UserPlatforms to update.
     */
    limit?: number;
};
/**
 * UserPlatform updateManyAndReturn
 */
export type UserPlatformUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPlatform
     */
    select?: Prisma.UserPlatformSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the UserPlatform
     */
    omit?: Prisma.UserPlatformOmit<ExtArgs> | null;
    /**
     * The data used to update UserPlatforms.
     */
    data: Prisma.XOR<Prisma.UserPlatformUpdateManyMutationInput, Prisma.UserPlatformUncheckedUpdateManyInput>;
    /**
     * Filter which UserPlatforms to update
     */
    where?: Prisma.UserPlatformWhereInput;
    /**
     * Limit how many UserPlatforms to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserPlatformIncludeUpdateManyAndReturn<ExtArgs> | null;
};
/**
 * UserPlatform upsert
 */
export type UserPlatformUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The filter to search for the UserPlatform to update in case it exists.
     */
    where: Prisma.UserPlatformWhereUniqueInput;
    /**
     * In case the UserPlatform found by the `where` argument doesn't exist, create a new UserPlatform with this data.
     */
    create: Prisma.XOR<Prisma.UserPlatformCreateInput, Prisma.UserPlatformUncheckedCreateInput>;
    /**
     * In case the UserPlatform was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.UserPlatformUpdateInput, Prisma.UserPlatformUncheckedUpdateInput>;
};
/**
 * UserPlatform delete
 */
export type UserPlatformDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter which UserPlatform to delete.
     */
    where: Prisma.UserPlatformWhereUniqueInput;
};
/**
 * UserPlatform deleteMany
 */
export type UserPlatformDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which UserPlatforms to delete
     */
    where?: Prisma.UserPlatformWhereInput;
    /**
     * Limit how many UserPlatforms to delete.
     */
    limit?: number;
};
/**
 * UserPlatform without action
 */
export type UserPlatformDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
};
export {};
//# sourceMappingURL=UserPlatform.d.ts.map