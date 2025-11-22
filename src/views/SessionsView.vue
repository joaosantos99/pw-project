<script>
import { BookOpen, Clock, Filter, Search, Trash2 } from "lucide-vue-next";

import ContentHeader from "@/components/ContentHeader.vue";
import PageWrapper from "@/components/PageWrapper.vue";

export default {
	name: "SessionsView",

	components: {
		ContentHeader,
		PageWrapper,
		Search,
		BookOpen,
		Filter,
		Trash2,
		Clock,
	},
};
</script>

<template>
  <PageWrapper>
    <ContentHeader
      title="Study Sessions"
      paragraph="View and manage your study sessions"
    />
    <div class="grid grid-cols-3 gap-6">
        <Card class="col-span-3 col-start-1 md:col-span-1">
          <div class="flex flex-col justify-between h-24">
            <div class="flex justify-between">
              <div>Total sessions</div>
              <BookOpen size="16" />
            </div>
            <div>
              <div class="text-xl font-semibold">
                8
              </div>
              <div class="text-xs">
                Logged study sessions
              </div>
            </div>
          </div>

        </Card />
        <Card class="col-span-3 col-start-1 md:col-span-1">
          <div class="flex flex-col justify-between h-24">
            <div class="flex justify-between">
              <div>Total hours</div>
              <BookOpen size="16" />
            </div>
            <div>
              <div class="text-xl font-semibold">
                7.4h
              </div>
              <div class="text-xs">
                Time spent studying
              </div>
            </div>
          </div>
        </Card>
        <Card class="col-span-3 col-start-1 md:col-span-1">
          <div class="flex flex-col justify-between h-24">
            <div class="flex justify-between">
              <div>Avg. Duration</div>
              <BookOpen size="16" />
            </div>
            <div>
              <div class="text-xl font-semibold">
                56min
              </div>
              <div class="text-xs">
                Per session
              </div>
            </div>
          </div>
        </Card>
        <Card class="col-span-3 col-start-1" title="Session Log" subtitle="Filter and search through your study session">
          <form @submit.prevent class="flex gap-2.5 mb-8 items-center">
            <InputField class="w-full" placeholder="Search sessions..."/>
            <Button :icon="Filter" variant="outline" class="flex">
              <Filter size="18" />
              <div>
                Filter
              </div>

            </Button>
          </form>
          <table class="table-auto w-full">
            <thead class="text-left border-b p-7">
              <tr>
                <th class="w-1/8">Subject</th>
                <th class="w-1/8">Duration</th>
                <th class="w-1/8">Date</th>
                <th class="w-1/8">Time</th>
                <th class="w-1/3">Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b">
                <td class="px-0.5 py-3">
                  <span class="text-xs bg-blue-300 px-2 py-1">Mathematics</span>
                </td>
                <td class="py-4">45m</td>
                <td class="py-4">Oct 18, 2025</td>
                <td class="py-4">9AM</td>
                <td class="py-4">Worked on calculus problems, focusing on derivatives</td>
                <td class="py-4"><Trash2 color="#E54B4F" size="18"/></td>
              </tr>
            </tbody>
          </table>
        </Card />
    </div>
  </PageWrapper>

</template>
