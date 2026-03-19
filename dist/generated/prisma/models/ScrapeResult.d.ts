import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model ScrapeResult
 *
 */
export type ScrapeResultModel = runtime.Types.Result.DefaultSelection<Prisma.$ScrapeResultPayload>;
export type AggregateScrapeResult = {
    _count: ScrapeResultCountAggregateOutputType | null;
    _avg: ScrapeResultAvgAggregateOutputType | null;
    _sum: ScrapeResultSumAggregateOutputType | null;
    _min: ScrapeResultMinAggregateOutputType | null;
    _max: ScrapeResultMaxAggregateOutputType | null;
};
export type ScrapeResultAvgAggregateOutputType = {
    likes: number | null;
    replies: number | null;
    retweets: number | null;
    bookmarks: number | null;
    views: number | null;
};
export type ScrapeResultSumAggregateOutputType = {
    likes: number | null;
    replies: number | null;
    retweets: number | null;
    bookmarks: number | null;
    views: number | null;
};
export type ScrapeResultMinAggregateOutputType = {
    id: string | null;
    platform: string | null;
    username: string | null;
    post_text: string | null;
    post_url: string | null;
    likes: number | null;
    replies: number | null;
    retweets: number | null;
    bookmarks: number | null;
    views: number | null;
    hook_type: string | null;
    posted_at: Date | null;
    scraped_at: Date | null;
};
export type ScrapeResultMaxAggregateOutputType = {
    id: string | null;
    platform: string | null;
    username: string | null;
    post_text: string | null;
    post_url: string | null;
    likes: number | null;
    replies: number | null;
    retweets: number | null;
    bookmarks: number | null;
    views: number | null;
    hook_type: string | null;
    posted_at: Date | null;
    scraped_at: Date | null;
};
export type ScrapeResultCountAggregateOutputType = {
    id: number;
    platform: number;
    username: number;
    post_text: number;
    post_url: number;
    likes: number;
    replies: number;
    retweets: number;
    bookmarks: number;
    views: number;
    hook_type: number;
    posted_at: number;
    scraped_at: number;
    _all: number;
};
export type ScrapeResultAvgAggregateInputType = {
    likes?: true;
    replies?: true;
    retweets?: true;
    bookmarks?: true;
    views?: true;
};
export type ScrapeResultSumAggregateInputType = {
    likes?: true;
    replies?: true;
    retweets?: true;
    bookmarks?: true;
    views?: true;
};
export type ScrapeResultMinAggregateInputType = {
    id?: true;
    platform?: true;
    username?: true;
    post_text?: true;
    post_url?: true;
    likes?: true;
    replies?: true;
    retweets?: true;
    bookmarks?: true;
    views?: true;
    hook_type?: true;
    posted_at?: true;
    scraped_at?: true;
};
export type ScrapeResultMaxAggregateInputType = {
    id?: true;
    platform?: true;
    username?: true;
    post_text?: true;
    post_url?: true;
    likes?: true;
    replies?: true;
    retweets?: true;
    bookmarks?: true;
    views?: true;
    hook_type?: true;
    posted_at?: true;
    scraped_at?: true;
};
export type ScrapeResultCountAggregateInputType = {
    id?: true;
    platform?: true;
    username?: true;
    post_text?: true;
    post_url?: true;
    likes?: true;
    replies?: true;
    retweets?: true;
    bookmarks?: true;
    views?: true;
    hook_type?: true;
    posted_at?: true;
    scraped_at?: true;
    _all?: true;
};
export type ScrapeResultAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which ScrapeResult to aggregate.
     */
    where?: Prisma.ScrapeResultWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ScrapeResults to fetch.
     */
    orderBy?: Prisma.ScrapeResultOrderByWithRelationInput | Prisma.ScrapeResultOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.ScrapeResultWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ScrapeResults from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ScrapeResults.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned ScrapeResults
    **/
    _count?: true | ScrapeResultCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: ScrapeResultAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: ScrapeResultSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: ScrapeResultMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: ScrapeResultMaxAggregateInputType;
};
export type GetScrapeResultAggregateType<T extends ScrapeResultAggregateArgs> = {
    [P in keyof T & keyof AggregateScrapeResult]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateScrapeResult[P]> : Prisma.GetScalarType<T[P], AggregateScrapeResult[P]>;
};
export type ScrapeResultGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ScrapeResultWhereInput;
    orderBy?: Prisma.ScrapeResultOrderByWithAggregationInput | Prisma.ScrapeResultOrderByWithAggregationInput[];
    by: Prisma.ScrapeResultScalarFieldEnum[] | Prisma.ScrapeResultScalarFieldEnum;
    having?: Prisma.ScrapeResultScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ScrapeResultCountAggregateInputType | true;
    _avg?: ScrapeResultAvgAggregateInputType;
    _sum?: ScrapeResultSumAggregateInputType;
    _min?: ScrapeResultMinAggregateInputType;
    _max?: ScrapeResultMaxAggregateInputType;
};
export type ScrapeResultGroupByOutputType = {
    id: string;
    platform: string;
    username: string;
    post_text: string | null;
    post_url: string | null;
    likes: number;
    replies: number;
    retweets: number;
    bookmarks: number;
    views: number;
    hook_type: string | null;
    posted_at: Date | null;
    scraped_at: Date;
    _count: ScrapeResultCountAggregateOutputType | null;
    _avg: ScrapeResultAvgAggregateOutputType | null;
    _sum: ScrapeResultSumAggregateOutputType | null;
    _min: ScrapeResultMinAggregateOutputType | null;
    _max: ScrapeResultMaxAggregateOutputType | null;
};
type GetScrapeResultGroupByPayload<T extends ScrapeResultGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ScrapeResultGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ScrapeResultGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ScrapeResultGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ScrapeResultGroupByOutputType[P]>;
}>>;
export type ScrapeResultWhereInput = {
    AND?: Prisma.ScrapeResultWhereInput | Prisma.ScrapeResultWhereInput[];
    OR?: Prisma.ScrapeResultWhereInput[];
    NOT?: Prisma.ScrapeResultWhereInput | Prisma.ScrapeResultWhereInput[];
    id?: Prisma.StringFilter<"ScrapeResult"> | string;
    platform?: Prisma.StringFilter<"ScrapeResult"> | string;
    username?: Prisma.StringFilter<"ScrapeResult"> | string;
    post_text?: Prisma.StringNullableFilter<"ScrapeResult"> | string | null;
    post_url?: Prisma.StringNullableFilter<"ScrapeResult"> | string | null;
    likes?: Prisma.IntFilter<"ScrapeResult"> | number;
    replies?: Prisma.IntFilter<"ScrapeResult"> | number;
    retweets?: Prisma.IntFilter<"ScrapeResult"> | number;
    bookmarks?: Prisma.IntFilter<"ScrapeResult"> | number;
    views?: Prisma.IntFilter<"ScrapeResult"> | number;
    hook_type?: Prisma.StringNullableFilter<"ScrapeResult"> | string | null;
    posted_at?: Prisma.DateTimeNullableFilter<"ScrapeResult"> | Date | string | null;
    scraped_at?: Prisma.DateTimeFilter<"ScrapeResult"> | Date | string;
};
export type ScrapeResultOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    platform?: Prisma.SortOrder;
    username?: Prisma.SortOrder;
    post_text?: Prisma.SortOrderInput | Prisma.SortOrder;
    post_url?: Prisma.SortOrderInput | Prisma.SortOrder;
    likes?: Prisma.SortOrder;
    replies?: Prisma.SortOrder;
    retweets?: Prisma.SortOrder;
    bookmarks?: Prisma.SortOrder;
    views?: Prisma.SortOrder;
    hook_type?: Prisma.SortOrderInput | Prisma.SortOrder;
    posted_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    scraped_at?: Prisma.SortOrder;
};
export type ScrapeResultWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.ScrapeResultWhereInput | Prisma.ScrapeResultWhereInput[];
    OR?: Prisma.ScrapeResultWhereInput[];
    NOT?: Prisma.ScrapeResultWhereInput | Prisma.ScrapeResultWhereInput[];
    platform?: Prisma.StringFilter<"ScrapeResult"> | string;
    username?: Prisma.StringFilter<"ScrapeResult"> | string;
    post_text?: Prisma.StringNullableFilter<"ScrapeResult"> | string | null;
    post_url?: Prisma.StringNullableFilter<"ScrapeResult"> | string | null;
    likes?: Prisma.IntFilter<"ScrapeResult"> | number;
    replies?: Prisma.IntFilter<"ScrapeResult"> | number;
    retweets?: Prisma.IntFilter<"ScrapeResult"> | number;
    bookmarks?: Prisma.IntFilter<"ScrapeResult"> | number;
    views?: Prisma.IntFilter<"ScrapeResult"> | number;
    hook_type?: Prisma.StringNullableFilter<"ScrapeResult"> | string | null;
    posted_at?: Prisma.DateTimeNullableFilter<"ScrapeResult"> | Date | string | null;
    scraped_at?: Prisma.DateTimeFilter<"ScrapeResult"> | Date | string;
}, "id">;
export type ScrapeResultOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    platform?: Prisma.SortOrder;
    username?: Prisma.SortOrder;
    post_text?: Prisma.SortOrderInput | Prisma.SortOrder;
    post_url?: Prisma.SortOrderInput | Prisma.SortOrder;
    likes?: Prisma.SortOrder;
    replies?: Prisma.SortOrder;
    retweets?: Prisma.SortOrder;
    bookmarks?: Prisma.SortOrder;
    views?: Prisma.SortOrder;
    hook_type?: Prisma.SortOrderInput | Prisma.SortOrder;
    posted_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    scraped_at?: Prisma.SortOrder;
    _count?: Prisma.ScrapeResultCountOrderByAggregateInput;
    _avg?: Prisma.ScrapeResultAvgOrderByAggregateInput;
    _max?: Prisma.ScrapeResultMaxOrderByAggregateInput;
    _min?: Prisma.ScrapeResultMinOrderByAggregateInput;
    _sum?: Prisma.ScrapeResultSumOrderByAggregateInput;
};
export type ScrapeResultScalarWhereWithAggregatesInput = {
    AND?: Prisma.ScrapeResultScalarWhereWithAggregatesInput | Prisma.ScrapeResultScalarWhereWithAggregatesInput[];
    OR?: Prisma.ScrapeResultScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ScrapeResultScalarWhereWithAggregatesInput | Prisma.ScrapeResultScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"ScrapeResult"> | string;
    platform?: Prisma.StringWithAggregatesFilter<"ScrapeResult"> | string;
    username?: Prisma.StringWithAggregatesFilter<"ScrapeResult"> | string;
    post_text?: Prisma.StringNullableWithAggregatesFilter<"ScrapeResult"> | string | null;
    post_url?: Prisma.StringNullableWithAggregatesFilter<"ScrapeResult"> | string | null;
    likes?: Prisma.IntWithAggregatesFilter<"ScrapeResult"> | number;
    replies?: Prisma.IntWithAggregatesFilter<"ScrapeResult"> | number;
    retweets?: Prisma.IntWithAggregatesFilter<"ScrapeResult"> | number;
    bookmarks?: Prisma.IntWithAggregatesFilter<"ScrapeResult"> | number;
    views?: Prisma.IntWithAggregatesFilter<"ScrapeResult"> | number;
    hook_type?: Prisma.StringNullableWithAggregatesFilter<"ScrapeResult"> | string | null;
    posted_at?: Prisma.DateTimeNullableWithAggregatesFilter<"ScrapeResult"> | Date | string | null;
    scraped_at?: Prisma.DateTimeWithAggregatesFilter<"ScrapeResult"> | Date | string;
};
export type ScrapeResultCreateInput = {
    id?: string;
    platform: string;
    username: string;
    post_text?: string | null;
    post_url?: string | null;
    likes?: number;
    replies?: number;
    retweets?: number;
    bookmarks?: number;
    views?: number;
    hook_type?: string | null;
    posted_at?: Date | string | null;
    scraped_at?: Date | string;
};
export type ScrapeResultUncheckedCreateInput = {
    id?: string;
    platform: string;
    username: string;
    post_text?: string | null;
    post_url?: string | null;
    likes?: number;
    replies?: number;
    retweets?: number;
    bookmarks?: number;
    views?: number;
    hook_type?: string | null;
    posted_at?: Date | string | null;
    scraped_at?: Date | string;
};
export type ScrapeResultUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    platform?: Prisma.StringFieldUpdateOperationsInput | string;
    username?: Prisma.StringFieldUpdateOperationsInput | string;
    post_text?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    post_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    likes?: Prisma.IntFieldUpdateOperationsInput | number;
    replies?: Prisma.IntFieldUpdateOperationsInput | number;
    retweets?: Prisma.IntFieldUpdateOperationsInput | number;
    bookmarks?: Prisma.IntFieldUpdateOperationsInput | number;
    views?: Prisma.IntFieldUpdateOperationsInput | number;
    hook_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    posted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    scraped_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ScrapeResultUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    platform?: Prisma.StringFieldUpdateOperationsInput | string;
    username?: Prisma.StringFieldUpdateOperationsInput | string;
    post_text?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    post_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    likes?: Prisma.IntFieldUpdateOperationsInput | number;
    replies?: Prisma.IntFieldUpdateOperationsInput | number;
    retweets?: Prisma.IntFieldUpdateOperationsInput | number;
    bookmarks?: Prisma.IntFieldUpdateOperationsInput | number;
    views?: Prisma.IntFieldUpdateOperationsInput | number;
    hook_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    posted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    scraped_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ScrapeResultCreateManyInput = {
    id?: string;
    platform: string;
    username: string;
    post_text?: string | null;
    post_url?: string | null;
    likes?: number;
    replies?: number;
    retweets?: number;
    bookmarks?: number;
    views?: number;
    hook_type?: string | null;
    posted_at?: Date | string | null;
    scraped_at?: Date | string;
};
export type ScrapeResultUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    platform?: Prisma.StringFieldUpdateOperationsInput | string;
    username?: Prisma.StringFieldUpdateOperationsInput | string;
    post_text?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    post_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    likes?: Prisma.IntFieldUpdateOperationsInput | number;
    replies?: Prisma.IntFieldUpdateOperationsInput | number;
    retweets?: Prisma.IntFieldUpdateOperationsInput | number;
    bookmarks?: Prisma.IntFieldUpdateOperationsInput | number;
    views?: Prisma.IntFieldUpdateOperationsInput | number;
    hook_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    posted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    scraped_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ScrapeResultUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    platform?: Prisma.StringFieldUpdateOperationsInput | string;
    username?: Prisma.StringFieldUpdateOperationsInput | string;
    post_text?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    post_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    likes?: Prisma.IntFieldUpdateOperationsInput | number;
    replies?: Prisma.IntFieldUpdateOperationsInput | number;
    retweets?: Prisma.IntFieldUpdateOperationsInput | number;
    bookmarks?: Prisma.IntFieldUpdateOperationsInput | number;
    views?: Prisma.IntFieldUpdateOperationsInput | number;
    hook_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    posted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    scraped_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ScrapeResultCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    platform?: Prisma.SortOrder;
    username?: Prisma.SortOrder;
    post_text?: Prisma.SortOrder;
    post_url?: Prisma.SortOrder;
    likes?: Prisma.SortOrder;
    replies?: Prisma.SortOrder;
    retweets?: Prisma.SortOrder;
    bookmarks?: Prisma.SortOrder;
    views?: Prisma.SortOrder;
    hook_type?: Prisma.SortOrder;
    posted_at?: Prisma.SortOrder;
    scraped_at?: Prisma.SortOrder;
};
export type ScrapeResultAvgOrderByAggregateInput = {
    likes?: Prisma.SortOrder;
    replies?: Prisma.SortOrder;
    retweets?: Prisma.SortOrder;
    bookmarks?: Prisma.SortOrder;
    views?: Prisma.SortOrder;
};
export type ScrapeResultMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    platform?: Prisma.SortOrder;
    username?: Prisma.SortOrder;
    post_text?: Prisma.SortOrder;
    post_url?: Prisma.SortOrder;
    likes?: Prisma.SortOrder;
    replies?: Prisma.SortOrder;
    retweets?: Prisma.SortOrder;
    bookmarks?: Prisma.SortOrder;
    views?: Prisma.SortOrder;
    hook_type?: Prisma.SortOrder;
    posted_at?: Prisma.SortOrder;
    scraped_at?: Prisma.SortOrder;
};
export type ScrapeResultMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    platform?: Prisma.SortOrder;
    username?: Prisma.SortOrder;
    post_text?: Prisma.SortOrder;
    post_url?: Prisma.SortOrder;
    likes?: Prisma.SortOrder;
    replies?: Prisma.SortOrder;
    retweets?: Prisma.SortOrder;
    bookmarks?: Prisma.SortOrder;
    views?: Prisma.SortOrder;
    hook_type?: Prisma.SortOrder;
    posted_at?: Prisma.SortOrder;
    scraped_at?: Prisma.SortOrder;
};
export type ScrapeResultSumOrderByAggregateInput = {
    likes?: Prisma.SortOrder;
    replies?: Prisma.SortOrder;
    retweets?: Prisma.SortOrder;
    bookmarks?: Prisma.SortOrder;
    views?: Prisma.SortOrder;
};
export type ScrapeResultSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    platform?: boolean;
    username?: boolean;
    post_text?: boolean;
    post_url?: boolean;
    likes?: boolean;
    replies?: boolean;
    retweets?: boolean;
    bookmarks?: boolean;
    views?: boolean;
    hook_type?: boolean;
    posted_at?: boolean;
    scraped_at?: boolean;
}, ExtArgs["result"]["scrapeResult"]>;
export type ScrapeResultSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    platform?: boolean;
    username?: boolean;
    post_text?: boolean;
    post_url?: boolean;
    likes?: boolean;
    replies?: boolean;
    retweets?: boolean;
    bookmarks?: boolean;
    views?: boolean;
    hook_type?: boolean;
    posted_at?: boolean;
    scraped_at?: boolean;
}, ExtArgs["result"]["scrapeResult"]>;
export type ScrapeResultSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    platform?: boolean;
    username?: boolean;
    post_text?: boolean;
    post_url?: boolean;
    likes?: boolean;
    replies?: boolean;
    retweets?: boolean;
    bookmarks?: boolean;
    views?: boolean;
    hook_type?: boolean;
    posted_at?: boolean;
    scraped_at?: boolean;
}, ExtArgs["result"]["scrapeResult"]>;
export type ScrapeResultSelectScalar = {
    id?: boolean;
    platform?: boolean;
    username?: boolean;
    post_text?: boolean;
    post_url?: boolean;
    likes?: boolean;
    replies?: boolean;
    retweets?: boolean;
    bookmarks?: boolean;
    views?: boolean;
    hook_type?: boolean;
    posted_at?: boolean;
    scraped_at?: boolean;
};
export type ScrapeResultOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "platform" | "username" | "post_text" | "post_url" | "likes" | "replies" | "retweets" | "bookmarks" | "views" | "hook_type" | "posted_at" | "scraped_at", ExtArgs["result"]["scrapeResult"]>;
export type $ScrapeResultPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "ScrapeResult";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        platform: string;
        username: string;
        post_text: string | null;
        post_url: string | null;
        likes: number;
        replies: number;
        retweets: number;
        bookmarks: number;
        views: number;
        hook_type: string | null;
        posted_at: Date | null;
        scraped_at: Date;
    }, ExtArgs["result"]["scrapeResult"]>;
    composites: {};
};
export type ScrapeResultGetPayload<S extends boolean | null | undefined | ScrapeResultDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ScrapeResultPayload, S>;
export type ScrapeResultCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ScrapeResultFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ScrapeResultCountAggregateInputType | true;
};
export interface ScrapeResultDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['ScrapeResult'];
        meta: {
            name: 'ScrapeResult';
        };
    };
    /**
     * Find zero or one ScrapeResult that matches the filter.
     * @param {ScrapeResultFindUniqueArgs} args - Arguments to find a ScrapeResult
     * @example
     * // Get one ScrapeResult
     * const scrapeResult = await prisma.scrapeResult.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ScrapeResultFindUniqueArgs>(args: Prisma.SelectSubset<T, ScrapeResultFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ScrapeResultClient<runtime.Types.Result.GetResult<Prisma.$ScrapeResultPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one ScrapeResult that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ScrapeResultFindUniqueOrThrowArgs} args - Arguments to find a ScrapeResult
     * @example
     * // Get one ScrapeResult
     * const scrapeResult = await prisma.scrapeResult.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ScrapeResultFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ScrapeResultFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ScrapeResultClient<runtime.Types.Result.GetResult<Prisma.$ScrapeResultPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first ScrapeResult that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScrapeResultFindFirstArgs} args - Arguments to find a ScrapeResult
     * @example
     * // Get one ScrapeResult
     * const scrapeResult = await prisma.scrapeResult.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ScrapeResultFindFirstArgs>(args?: Prisma.SelectSubset<T, ScrapeResultFindFirstArgs<ExtArgs>>): Prisma.Prisma__ScrapeResultClient<runtime.Types.Result.GetResult<Prisma.$ScrapeResultPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first ScrapeResult that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScrapeResultFindFirstOrThrowArgs} args - Arguments to find a ScrapeResult
     * @example
     * // Get one ScrapeResult
     * const scrapeResult = await prisma.scrapeResult.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ScrapeResultFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ScrapeResultFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ScrapeResultClient<runtime.Types.Result.GetResult<Prisma.$ScrapeResultPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more ScrapeResults that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScrapeResultFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ScrapeResults
     * const scrapeResults = await prisma.scrapeResult.findMany()
     *
     * // Get first 10 ScrapeResults
     * const scrapeResults = await prisma.scrapeResult.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const scrapeResultWithIdOnly = await prisma.scrapeResult.findMany({ select: { id: true } })
     *
     */
    findMany<T extends ScrapeResultFindManyArgs>(args?: Prisma.SelectSubset<T, ScrapeResultFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ScrapeResultPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a ScrapeResult.
     * @param {ScrapeResultCreateArgs} args - Arguments to create a ScrapeResult.
     * @example
     * // Create one ScrapeResult
     * const ScrapeResult = await prisma.scrapeResult.create({
     *   data: {
     *     // ... data to create a ScrapeResult
     *   }
     * })
     *
     */
    create<T extends ScrapeResultCreateArgs>(args: Prisma.SelectSubset<T, ScrapeResultCreateArgs<ExtArgs>>): Prisma.Prisma__ScrapeResultClient<runtime.Types.Result.GetResult<Prisma.$ScrapeResultPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many ScrapeResults.
     * @param {ScrapeResultCreateManyArgs} args - Arguments to create many ScrapeResults.
     * @example
     * // Create many ScrapeResults
     * const scrapeResult = await prisma.scrapeResult.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends ScrapeResultCreateManyArgs>(args?: Prisma.SelectSubset<T, ScrapeResultCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many ScrapeResults and returns the data saved in the database.
     * @param {ScrapeResultCreateManyAndReturnArgs} args - Arguments to create many ScrapeResults.
     * @example
     * // Create many ScrapeResults
     * const scrapeResult = await prisma.scrapeResult.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many ScrapeResults and only return the `id`
     * const scrapeResultWithIdOnly = await prisma.scrapeResult.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends ScrapeResultCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ScrapeResultCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ScrapeResultPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a ScrapeResult.
     * @param {ScrapeResultDeleteArgs} args - Arguments to delete one ScrapeResult.
     * @example
     * // Delete one ScrapeResult
     * const ScrapeResult = await prisma.scrapeResult.delete({
     *   where: {
     *     // ... filter to delete one ScrapeResult
     *   }
     * })
     *
     */
    delete<T extends ScrapeResultDeleteArgs>(args: Prisma.SelectSubset<T, ScrapeResultDeleteArgs<ExtArgs>>): Prisma.Prisma__ScrapeResultClient<runtime.Types.Result.GetResult<Prisma.$ScrapeResultPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one ScrapeResult.
     * @param {ScrapeResultUpdateArgs} args - Arguments to update one ScrapeResult.
     * @example
     * // Update one ScrapeResult
     * const scrapeResult = await prisma.scrapeResult.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends ScrapeResultUpdateArgs>(args: Prisma.SelectSubset<T, ScrapeResultUpdateArgs<ExtArgs>>): Prisma.Prisma__ScrapeResultClient<runtime.Types.Result.GetResult<Prisma.$ScrapeResultPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more ScrapeResults.
     * @param {ScrapeResultDeleteManyArgs} args - Arguments to filter ScrapeResults to delete.
     * @example
     * // Delete a few ScrapeResults
     * const { count } = await prisma.scrapeResult.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends ScrapeResultDeleteManyArgs>(args?: Prisma.SelectSubset<T, ScrapeResultDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more ScrapeResults.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScrapeResultUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ScrapeResults
     * const scrapeResult = await prisma.scrapeResult.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends ScrapeResultUpdateManyArgs>(args: Prisma.SelectSubset<T, ScrapeResultUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more ScrapeResults and returns the data updated in the database.
     * @param {ScrapeResultUpdateManyAndReturnArgs} args - Arguments to update many ScrapeResults.
     * @example
     * // Update many ScrapeResults
     * const scrapeResult = await prisma.scrapeResult.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more ScrapeResults and only return the `id`
     * const scrapeResultWithIdOnly = await prisma.scrapeResult.updateManyAndReturn({
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
    updateManyAndReturn<T extends ScrapeResultUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ScrapeResultUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ScrapeResultPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one ScrapeResult.
     * @param {ScrapeResultUpsertArgs} args - Arguments to update or create a ScrapeResult.
     * @example
     * // Update or create a ScrapeResult
     * const scrapeResult = await prisma.scrapeResult.upsert({
     *   create: {
     *     // ... data to create a ScrapeResult
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ScrapeResult we want to update
     *   }
     * })
     */
    upsert<T extends ScrapeResultUpsertArgs>(args: Prisma.SelectSubset<T, ScrapeResultUpsertArgs<ExtArgs>>): Prisma.Prisma__ScrapeResultClient<runtime.Types.Result.GetResult<Prisma.$ScrapeResultPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of ScrapeResults.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScrapeResultCountArgs} args - Arguments to filter ScrapeResults to count.
     * @example
     * // Count the number of ScrapeResults
     * const count = await prisma.scrapeResult.count({
     *   where: {
     *     // ... the filter for the ScrapeResults we want to count
     *   }
     * })
    **/
    count<T extends ScrapeResultCountArgs>(args?: Prisma.Subset<T, ScrapeResultCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ScrapeResultCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a ScrapeResult.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScrapeResultAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ScrapeResultAggregateArgs>(args: Prisma.Subset<T, ScrapeResultAggregateArgs>): Prisma.PrismaPromise<GetScrapeResultAggregateType<T>>;
    /**
     * Group by ScrapeResult.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScrapeResultGroupByArgs} args - Group by arguments.
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
    groupBy<T extends ScrapeResultGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ScrapeResultGroupByArgs['orderBy'];
    } : {
        orderBy?: ScrapeResultGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ScrapeResultGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetScrapeResultGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the ScrapeResult model
     */
    readonly fields: ScrapeResultFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for ScrapeResult.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__ScrapeResultClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
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
 * Fields of the ScrapeResult model
 */
export interface ScrapeResultFieldRefs {
    readonly id: Prisma.FieldRef<"ScrapeResult", 'String'>;
    readonly platform: Prisma.FieldRef<"ScrapeResult", 'String'>;
    readonly username: Prisma.FieldRef<"ScrapeResult", 'String'>;
    readonly post_text: Prisma.FieldRef<"ScrapeResult", 'String'>;
    readonly post_url: Prisma.FieldRef<"ScrapeResult", 'String'>;
    readonly likes: Prisma.FieldRef<"ScrapeResult", 'Int'>;
    readonly replies: Prisma.FieldRef<"ScrapeResult", 'Int'>;
    readonly retweets: Prisma.FieldRef<"ScrapeResult", 'Int'>;
    readonly bookmarks: Prisma.FieldRef<"ScrapeResult", 'Int'>;
    readonly views: Prisma.FieldRef<"ScrapeResult", 'Int'>;
    readonly hook_type: Prisma.FieldRef<"ScrapeResult", 'String'>;
    readonly posted_at: Prisma.FieldRef<"ScrapeResult", 'DateTime'>;
    readonly scraped_at: Prisma.FieldRef<"ScrapeResult", 'DateTime'>;
}
/**
 * ScrapeResult findUnique
 */
export type ScrapeResultFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScrapeResult
     */
    select?: Prisma.ScrapeResultSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ScrapeResult
     */
    omit?: Prisma.ScrapeResultOmit<ExtArgs> | null;
    /**
     * Filter, which ScrapeResult to fetch.
     */
    where: Prisma.ScrapeResultWhereUniqueInput;
};
/**
 * ScrapeResult findUniqueOrThrow
 */
export type ScrapeResultFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScrapeResult
     */
    select?: Prisma.ScrapeResultSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ScrapeResult
     */
    omit?: Prisma.ScrapeResultOmit<ExtArgs> | null;
    /**
     * Filter, which ScrapeResult to fetch.
     */
    where: Prisma.ScrapeResultWhereUniqueInput;
};
/**
 * ScrapeResult findFirst
 */
export type ScrapeResultFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScrapeResult
     */
    select?: Prisma.ScrapeResultSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ScrapeResult
     */
    omit?: Prisma.ScrapeResultOmit<ExtArgs> | null;
    /**
     * Filter, which ScrapeResult to fetch.
     */
    where?: Prisma.ScrapeResultWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ScrapeResults to fetch.
     */
    orderBy?: Prisma.ScrapeResultOrderByWithRelationInput | Prisma.ScrapeResultOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for ScrapeResults.
     */
    cursor?: Prisma.ScrapeResultWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ScrapeResults from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ScrapeResults.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ScrapeResults.
     */
    distinct?: Prisma.ScrapeResultScalarFieldEnum | Prisma.ScrapeResultScalarFieldEnum[];
};
/**
 * ScrapeResult findFirstOrThrow
 */
export type ScrapeResultFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScrapeResult
     */
    select?: Prisma.ScrapeResultSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ScrapeResult
     */
    omit?: Prisma.ScrapeResultOmit<ExtArgs> | null;
    /**
     * Filter, which ScrapeResult to fetch.
     */
    where?: Prisma.ScrapeResultWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ScrapeResults to fetch.
     */
    orderBy?: Prisma.ScrapeResultOrderByWithRelationInput | Prisma.ScrapeResultOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for ScrapeResults.
     */
    cursor?: Prisma.ScrapeResultWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ScrapeResults from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ScrapeResults.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ScrapeResults.
     */
    distinct?: Prisma.ScrapeResultScalarFieldEnum | Prisma.ScrapeResultScalarFieldEnum[];
};
/**
 * ScrapeResult findMany
 */
export type ScrapeResultFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScrapeResult
     */
    select?: Prisma.ScrapeResultSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ScrapeResult
     */
    omit?: Prisma.ScrapeResultOmit<ExtArgs> | null;
    /**
     * Filter, which ScrapeResults to fetch.
     */
    where?: Prisma.ScrapeResultWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ScrapeResults to fetch.
     */
    orderBy?: Prisma.ScrapeResultOrderByWithRelationInput | Prisma.ScrapeResultOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing ScrapeResults.
     */
    cursor?: Prisma.ScrapeResultWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ScrapeResults from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ScrapeResults.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ScrapeResults.
     */
    distinct?: Prisma.ScrapeResultScalarFieldEnum | Prisma.ScrapeResultScalarFieldEnum[];
};
/**
 * ScrapeResult create
 */
export type ScrapeResultCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScrapeResult
     */
    select?: Prisma.ScrapeResultSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ScrapeResult
     */
    omit?: Prisma.ScrapeResultOmit<ExtArgs> | null;
    /**
     * The data needed to create a ScrapeResult.
     */
    data: Prisma.XOR<Prisma.ScrapeResultCreateInput, Prisma.ScrapeResultUncheckedCreateInput>;
};
/**
 * ScrapeResult createMany
 */
export type ScrapeResultCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many ScrapeResults.
     */
    data: Prisma.ScrapeResultCreateManyInput | Prisma.ScrapeResultCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * ScrapeResult createManyAndReturn
 */
export type ScrapeResultCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScrapeResult
     */
    select?: Prisma.ScrapeResultSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the ScrapeResult
     */
    omit?: Prisma.ScrapeResultOmit<ExtArgs> | null;
    /**
     * The data used to create many ScrapeResults.
     */
    data: Prisma.ScrapeResultCreateManyInput | Prisma.ScrapeResultCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * ScrapeResult update
 */
export type ScrapeResultUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScrapeResult
     */
    select?: Prisma.ScrapeResultSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ScrapeResult
     */
    omit?: Prisma.ScrapeResultOmit<ExtArgs> | null;
    /**
     * The data needed to update a ScrapeResult.
     */
    data: Prisma.XOR<Prisma.ScrapeResultUpdateInput, Prisma.ScrapeResultUncheckedUpdateInput>;
    /**
     * Choose, which ScrapeResult to update.
     */
    where: Prisma.ScrapeResultWhereUniqueInput;
};
/**
 * ScrapeResult updateMany
 */
export type ScrapeResultUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update ScrapeResults.
     */
    data: Prisma.XOR<Prisma.ScrapeResultUpdateManyMutationInput, Prisma.ScrapeResultUncheckedUpdateManyInput>;
    /**
     * Filter which ScrapeResults to update
     */
    where?: Prisma.ScrapeResultWhereInput;
    /**
     * Limit how many ScrapeResults to update.
     */
    limit?: number;
};
/**
 * ScrapeResult updateManyAndReturn
 */
export type ScrapeResultUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScrapeResult
     */
    select?: Prisma.ScrapeResultSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the ScrapeResult
     */
    omit?: Prisma.ScrapeResultOmit<ExtArgs> | null;
    /**
     * The data used to update ScrapeResults.
     */
    data: Prisma.XOR<Prisma.ScrapeResultUpdateManyMutationInput, Prisma.ScrapeResultUncheckedUpdateManyInput>;
    /**
     * Filter which ScrapeResults to update
     */
    where?: Prisma.ScrapeResultWhereInput;
    /**
     * Limit how many ScrapeResults to update.
     */
    limit?: number;
};
/**
 * ScrapeResult upsert
 */
export type ScrapeResultUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScrapeResult
     */
    select?: Prisma.ScrapeResultSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ScrapeResult
     */
    omit?: Prisma.ScrapeResultOmit<ExtArgs> | null;
    /**
     * The filter to search for the ScrapeResult to update in case it exists.
     */
    where: Prisma.ScrapeResultWhereUniqueInput;
    /**
     * In case the ScrapeResult found by the `where` argument doesn't exist, create a new ScrapeResult with this data.
     */
    create: Prisma.XOR<Prisma.ScrapeResultCreateInput, Prisma.ScrapeResultUncheckedCreateInput>;
    /**
     * In case the ScrapeResult was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.ScrapeResultUpdateInput, Prisma.ScrapeResultUncheckedUpdateInput>;
};
/**
 * ScrapeResult delete
 */
export type ScrapeResultDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScrapeResult
     */
    select?: Prisma.ScrapeResultSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ScrapeResult
     */
    omit?: Prisma.ScrapeResultOmit<ExtArgs> | null;
    /**
     * Filter which ScrapeResult to delete.
     */
    where: Prisma.ScrapeResultWhereUniqueInput;
};
/**
 * ScrapeResult deleteMany
 */
export type ScrapeResultDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which ScrapeResults to delete
     */
    where?: Prisma.ScrapeResultWhereInput;
    /**
     * Limit how many ScrapeResults to delete.
     */
    limit?: number;
};
/**
 * ScrapeResult without action
 */
export type ScrapeResultDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScrapeResult
     */
    select?: Prisma.ScrapeResultSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ScrapeResult
     */
    omit?: Prisma.ScrapeResultOmit<ExtArgs> | null;
};
export {};
//# sourceMappingURL=ScrapeResult.d.ts.map