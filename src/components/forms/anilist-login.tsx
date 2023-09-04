import { component$, $, useSignal } from "@builder.io/qwik";
import { useForm } from "@modular-forms/qwik";
import type { SubmitHandler } from "@modular-forms/qwik";
import type { ApiClientForm } from "~/routes";
import { useLocation, useNavigate } from "@builder.io/qwik-city";

export default component$(() => {
  const nav = useNavigate();
  const loc = useLocation();
  const [, { Form, Field }] = useForm<ApiClientForm>({
    loader: useSignal({ client_id: "" }),
  });

  const handleSubmit = $<SubmitHandler<ApiClientForm>>((values) => {
    nav(
      `https://anilist.co/api/v2/oauth/authorize?client_id=${values.client_id}&response_type=token`,
    );
  });

  return (
    <Form onSubmit$={handleSubmit}>
      <div class="flex flex-col gap-4 items-center">
        <p>
          <a href="https://anilist.co/settings/developer" class="text-primary">
            Create an app
          </a>{" "}
          and set the redirect_uri to{" "}
          <p>
            <span class="rounded-full text-primary bg-surface">
              {loc.url.protocol +
                "//" +
                loc.url.host +
                `${
                  loc.url.host.startsWith("localhost")
                    ? ""
                    : ".baby-beamup.club"
                }` +
                "/oauth/anilist/"}
            </span>
          </p>
        </p>
        <Field name="client_id">
          {(field, props) => (
            <input
              {...props}
              type="text"
              value={field.value}
              placeholder="Client Id"
              class="py-2.5 px-3 h-10 font-sans text-lg font-normal rounded-lg border transition-all focus:border-2 bg-background/20 text-on-surface outline outline-0"
            />
          )}
        </Field>
        <button
          type="submit"
          class={`inline-flex items-center py-1.5 px-4 text-sm font-medium text-center rounded-full border border-outline bg-primary/30`}
        >
          Submit
        </button>
      </div>
    </Form>
  );
});
