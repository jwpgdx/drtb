<template>
  <Dialog v-model:open="isOpen">
    <DialogTrigger as-child>
      <span class="text-blue-600 underline">API 키 사용 동의</span>
    </DialogTrigger>

    <DialogContent class="max-w-md">
      <DialogHeader>
        <DialogTitle>API 사용 동의</DialogTitle>
      </DialogHeader>
      <DialogDescription>
        <p>
          본 서비스는 사용자가 제공하는 API 키를 이용해 데이터에 접근합니다. 이
          API 키는 오직 사용자 인증 및 거래 관련 작업에만 사용되며, 보안을 위해
          서버에 저장되지 않고 클라이언트 측에서만 처리됩니다.
        </p>
        <p>
          사용자는 본 서비스를 이용함으로써 API 키를 제공하는 것에 동의하게
          되며, 이를 통해 발생하는 모든 거래 및 서비스 이용에 대해 책임을
          집니다.
        </p>
        <p>
          사용자는 제공한 API 키를 안전하게 관리할 책임이 있으며, 해당 키가
          유출되지 않도록 주의해야 합니다. 본 서비스는 API 키 유출로 인한 손해에
          대해 책임을 지지 않으며, 키 유출로 인한 모든 결과는 사용자 본인의
          책임입니다.
        </p>
        <p>
          서비스 이용 중 발생할 수 있는 예기치 못한 오류나 손해에 대해서는 본
          서비스 제공자가 책임을 지지 않으며, 사용자는 이에 대한 책임을 집니다.
          또한, 본 서비스는 사용자의 동의 없이 API 키를 외부에 전달하지 않으며,
          제공된 API 키를 통한 거래나 서비스 이용에 대해서는 사용자가 모든
          책임을 집니다.
        </p>
      </DialogDescription>
      <!-- Step 표시 -->

      <DialogFooter class="sm:justify-start">
        <DialogClose as-child>
          <Button type="button" variant="secondary">Close</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CircleHelp } from "lucide-vue-next";

const isOpen = ref(false);
</script>
