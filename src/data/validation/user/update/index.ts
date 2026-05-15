import { stringNotRequired } from '@main/utils';
import { yup } from '@infra/yup';

export const updateUserSchema = yup.object().shape({
  body: yup.object().shape({
    avatar: stringNotRequired(),
    name: stringNotRequired()
  })
});
