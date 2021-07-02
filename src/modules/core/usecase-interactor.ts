import { Request, Response, NextFunction } from 'express';
import { HttpStatus } from '../common/http-status.enum';

export const PAGINATION_HEADER_PAGES = 'X-Pagination-Pages';
export const PAGINATION_HEADER_CURRENT_PAGE = 'X-Pagination-Current-Page';
export const PAGINATION_HEADER_PAGE_SIZE = 'X-Pagination-Page-Size';

export const HEADER_EXPOSE_HEADERS = 'Access-Control-Expose-Headers';
export const EXPOSE_HEADERS = `${PAGINATION_HEADER_CURRENT_PAGE}, ${PAGINATION_HEADER_PAGES}`;

export interface IRequestObject {
    [key: string]: any;
}

export interface IViewPresenter {
    success(...details: any[]);
    error(...details: any[]);
}

/**
 * UseCase interactor allows us to decouple of business logic from any framework.
 * It allows us to test our business without infrastructure.
 * @see https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html
 */
export interface IUseCaseInteractor {
    presenter: IViewPresenter;
    setPresenter(presenter: IViewPresenter);
    execute(request: IRequestObject): Promise<any>;
}

export class Interactor implements IUseCaseInteractor {
    private _presenter: IViewPresenter;

    get presenter() {
        return this._presenter;
    }

    setPresenter(presenter: IViewPresenter) {
        this._presenter = presenter;
        return this;
    }

    async execute(request: IRequestObject) {
        return true;
    }
}

export interface PaginationData {
    page: number;
    pageSize: number;
    totalPages: number;
}

// TODO: move out to separate file
export class ExpressJSONPresenter implements IViewPresenter {
    constructor(
        // @ts-ignore
        protected readonly _req: Request,
        protected readonly _res: Response,
        // @ts-ignore
        protected readonly _next?: NextFunction,
    ) {}

    success(...args: any[]) {
        this._res.json(...args);
    }

    error(...args: any[]) {
        return this._res.status(HttpStatus.BAD_REQUEST).json({ errors: [...args] });
    }
}
export class ExpressJSONSearchPresenter extends ExpressJSONPresenter {
    success(rows: any[], pagination: PaginationData) {
        return this._res
            .status(HttpStatus.OK)
            .header(HEADER_EXPOSE_HEADERS, EXPOSE_HEADERS)
            .header(PAGINATION_HEADER_CURRENT_PAGE, String(pagination.page))
            .header(PAGINATION_HEADER_PAGES, String(pagination.totalPages))
            .header(PAGINATION_HEADER_PAGE_SIZE, String(pagination.pageSize))
            .json(rows);
    }

    error(errors: any[]) {
        return this._res
            .status(HttpStatus.BAD_REQUEST)
            .header(PAGINATION_HEADER_CURRENT_PAGE, '0')
            .header(PAGINATION_HEADER_PAGES, '0')
            .header(PAGINATION_HEADER_PAGE_SIZE, '0')
            .json({ errors });
    }
}

export class ExpressJSONCreatePresenter extends ExpressJSONPresenter {
    success(item: any) {
        return this._res.status(HttpStatus.CREATED).json(item);
    }

    error(errors: any[]) {
        return this._res.status(HttpStatus.BAD_REQUEST).json({ errors });
    }
}

export class ExpressJSONDeletePresenter extends ExpressJSONPresenter {
    success(item: any) {
        return this._res.status(HttpStatus.OK).json(item);
    }

    error(errors: any[]) {
        return this._res.status(HttpStatus.NOT_ACCEPTABLE).json({ errors });
    }
}

export class ExpressJSONShowPresenter extends ExpressJSONPresenter {
    success(item: any) {
        return this._res.status(HttpStatus.OK).json(item);
    }

    error(errors: any[]) {
        return this._res.status(HttpStatus.NOT_FOUND).json({ errors });
    }
}

export class ExpressJSONUpdatePresenter extends ExpressJSONPresenter {
    success(item: any) {
        return this._res.status(HttpStatus.OK).json(item);
    }

    error(errors: any[]) {
        return this._res.status(HttpStatus.BAD_REQUEST).json({ errors });
    }
}

export class ExpressAuthPresenter extends ExpressJSONPresenter {
    success() {
        this._next();
    }

    error(errors: any[]) {
        return this._res.status(HttpStatus.UNAUTHORIZED).json({ errors });
    }
}

export class ExpressRawPresenter extends ExpressJSONPresenter {
    success(data: any) {
        return this._res.status(HttpStatus.OK).send(data);
    }

    error(errors: any[]) {
        return this._res.status(HttpStatus.BAD_REQUEST).json({ errors });
    }
}

export class JSONResultPresenter implements IViewPresenter {
    public result;
    success(item: any) {
        this.result = item;
        return item;
    }

    error(errors: any[]) {
        this.result = null;
        return errors;
    }
}
