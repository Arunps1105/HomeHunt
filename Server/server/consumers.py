from channels.generic.websocket import AsyncWebsocketConsumer
import json
from .models import Chat
from asgiref.sync import sync_to_async


class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room"]
        self.room_group_name = f"chat_{self.room_name}"
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        message  = data.get("message", "")
        sender   = data.get("sender")
        sender_id = data.get("sender_id", 0)
        msg_type = data.get("type", "message")

        # -------- TYPING EVENT --------
        if msg_type == "typing":
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "typing_event",
                    "sender_id": sender_id,
                    "is_typing": data.get("is_typing", False)
                }
            )
            return

        # -------- SEEN EVENT --------
        if msg_type == "seen":
            await self.mark_seen()
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "seen_event",
                    "sender_id": sender_id
                }
            )
            return

        # -------- FILE UPLOADED EVENT --------
        if msg_type == "file_uploaded":
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "file_uploaded_event",
                    "id": data.get("id"),
                    "file": data.get("file", ""),
                    "message": "",
                    "sender": sender,
                    "sender_id": sender_id,
                    "created_at": data.get("created_at", ""),
                    "is_seen": False,
                }
            )
            return

        # -------- NORMAL MESSAGE --------
        msg = await self.save_message(message, sender, sender_id)
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "id": msg.id,
                "message": message,
                "sender": sender,
                "sender_id": sender_id,
                "file": msg.file.name if msg.file else "",
                "created_at": msg.created_at.isoformat(),
                "is_seen": False,
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            "type": "message",
            "id": event.get("id"),
            "message": event["message"],
            "sender": event["sender"],
            "sender_id": event["sender_id"],
            "file": event.get("file", ""),
            "created_at": event.get("created_at", ""),
            "is_seen": event.get("is_seen", False),
        }))

    async def typing_event(self, event):
        await self.send(text_data=json.dumps({
            "type": "typing",
            "sender_id": event["sender_id"],
            "is_typing": event["is_typing"]
        }))

    async def seen_event(self, event):
        await self.send(text_data=json.dumps({
            "type": "seen",
            "sender_id": event["sender_id"]
        }))

    async def file_uploaded_event(self, event):
        await self.send(text_data=json.dumps({
            "type": "file_uploaded",
            "id": event.get("id"),
            "file": event.get("file", ""),
            "message": "",
            "sender": event["sender"],
            "sender_id": event["sender_id"],
            "created_at": event.get("created_at", ""),
            "is_seen": False,
        }))

    # -------- DATABASE FUNCTIONS --------

    @sync_to_async
    def save_message(self, message, sender, sender_id):
        try:
            sender_id = int(sender_id)
        except:
            sender_id = 0
        return Chat.objects.create(
            request_id=int(self.room_name),
            message=message or "",
            sender=sender or "user",
            sender_id=sender_id,
            is_seen=False
        )

    @sync_to_async
    def mark_seen(self):
        Chat.objects.filter(
            request_id=int(self.room_name),
            is_seen=False
        ).update(is_seen=True)