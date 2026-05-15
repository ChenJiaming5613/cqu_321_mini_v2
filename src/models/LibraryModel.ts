import StdModel from "@/core/StdModel";
import {stdRequest} from "@/core/network";
import {err, ok, type Result} from "@/core/result";

class LibraryModel extends StdModel {
    private static _instance: LibraryModel | null = null;

    public static getInstance(): LibraryModel {
        if (this._instance === null) this._instance = new LibraryModel();
        return this._instance;
    }

    private constructor() {
        super();
    }

    public async update(isCurr=true): Promise<Result<BookInfo[]>> {
        try {
            const res = await stdRequest<LibraryBorrowResponse>({
                url: "/library/borrow",
                data: { is_curr: isCurr },
                method: "GET"
            });
            return ok(convertToBookInfos(res));
        } catch (e) {
            console.error("[LibraryModel] update failed", e);
            return err(e);
        }
    }
}
export default LibraryModel;

type LibraryBorrowResponse = {
    book_infos: any[]
}

function convertToBookInfos(res: LibraryBorrowResponse): BookInfo[] {
    return res.book_infos.map((it: any) => {
       return {
           borrowTime: it.borrow_time,
           callNo: it.call_no,
           canRenew: it.can_renew,
           id: it.id,
           isReturn: it.is_return,
           libraryName: it.library_name,
           renewCount: it.renew_count,
           returnTime: it.return_time,
           shouldReturnTime: it.should_return_time,
           title: it.title
       } as BookInfo;
    });
}

export type BookInfo = {
    id: number | null   // 书籍id
    title: string   // 书籍名称
    callNo: string  // 书籍检索号
    libraryName: string // 所属图书馆
    borrowTime: string // 借出时间
    shouldReturnTime: string | null // 应归还日期
    isReturn: boolean // 是否被归还
    returnTime: string | null // 归还时间
    renewCount: number // 续借次数
    canRenew: boolean // 是否可被续借
}
