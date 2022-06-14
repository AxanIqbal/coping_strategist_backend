import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    if (context.getType() === 'http') {
      return context.switchToHttp().getRequest().user;
    }
    return null;
    // const ctx = GqlExecutionContext.create(context);
    // return ctx.getContext().req.user;
  },
);
