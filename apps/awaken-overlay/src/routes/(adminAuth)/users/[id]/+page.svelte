<script lang="ts">
  import { enhance } from '$app/forms';
  import { slide } from 'svelte/transition';
  import type { ActionData, PageServerData } from './$types';
  import {
    Table,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
    Tabs,
    TabItem,
    Input,
    Label,
    Toggle,
    Button,
    Toast
  } from 'flowbite-svelte';
  import Notifications from '$lib/components/Notifications.svelte';

  export let data: PageServerData;
  export let form: ActionData;

  let isSuccess = false;
</script>

<Tabs>
  <TabItem title="Infos" open>
    <form
      method="POST"
      use:enhance={({ formData, action, cancel }) => {
        let isAdmin = false;
        if (formData.has('isAdmin')) {
          isAdmin = true;
          formData.delete('isAdmin');
        }

        formData.append('isAdmin', isAdmin.toString());
        isSuccess = false;
        return async ({ result }) => {
          if (result.type === 'success') isSuccess = true;
        };
      }}
    >
      <div class="flex items-center">
        <div class="flex text-center items-center pr-10">
          <div class="pr-2">
            <Label for="username">Username</Label>
          </div>
          <div class="self-end">
            <Input type="text" value={data.user.username} name="username" id="username" required />
          </div>
        </div>

        <div class="pr-4">
          <Toggle id="isAdmin" checked={data.user.isAdmin} name="isAdmin">Admin</Toggle>
        </div>
      </div>

      <Button type="submit">Save</Button>
    </form>
  </TabItem>
  <TabItem title="Login attempts">
    <Table>
      <TableHead>
        <TableHeadCell>When</TableHeadCell>
        <TableHeadCell>IP</TableHeadCell>
        <TableHeadCell>User-Agent</TableHeadCell>
        <TableHeadCell>Success</TableHeadCell>
        <TableHead>Tried Password</TableHead>
      </TableHead>
      <TableBody>
        {#each data.loginAttempts as attempt}
          <TableBodyRow>
            <TableBodyCell>{attempt.when}</TableBodyCell>
            <TableBodyCell>{attempt.ipAddress}</TableBodyCell>
            <TableBodyCell>{attempt.userAgent}</TableBodyCell>
            <TableBodyCell>{attempt.sucessful}</TableBodyCell>
            <TableBodyCell>{attempt.triedPassword}</TableBodyCell>
          </TableBodyRow>
        {/each}
      </TableBody>
    </Table>
  </TabItem>
</Tabs>
<Notifications error={form?.error} success={isSuccess ? 'Successfully updated' : undefined} />
